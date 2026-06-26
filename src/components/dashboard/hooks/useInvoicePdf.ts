import { useState, useEffect } from "react";

interface AppointmentData {
  id: number;
  fecha: string;
  service: { nombre: string };
  user: { nombre: string; telefono?: string };
  sede?: { nombre: string };
  payment?: { totalAmount: number };
}

export function useInvoicePdf() {
  const [html2pdf, setHtml2pdf] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Carga asíncrona segura de la librería del lado del cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("html2pdf.js" as any).then((module) => {
        setHtml2pdf(() => module.default);
      });
    }
  }, []);

  const ejecutarFallback = (blob: Blob, telefono: string, mensaje: string, id: number) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `factura-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    window.open(`https://wa.me/${telefono}?text=${mensaje}`, "_blank");
    alert("PDF descargado en tu equipo. Adjúntalo manualmente en WhatsApp.");
  };

  const generateAndSendWhatsApp = async (appointment: AppointmentData) => {
    if (!appointment || !html2pdf) return;
    setIsGenerating(true);

    try {
      const response = await fetch("/invoiceTemplate.html");
      if (!response.ok) throw new Error("No se encontró la plantilla");
      const template = await response.text();

      const total = appointment.payment?.totalAmount || 0;
      const serviceHtml = `
        <div class='table-row'>
          <div>${appointment.service.nombre}</div>
          <div>1</div>
          <div>€${total.toFixed(2)}</div>
        </div>
      `;

      const html = template
        .replace("{{clientName}}", appointment.user.nombre || "Cliente")
        .replace("{{sede}}", appointment.sede?.nombre || "General")
        .replace("{{invoiceNumber}}", `INV-${appointment.id}`)
        .replace("{{date}}", new Date(appointment.fecha).toLocaleDateString("es-CO"))
        .replace("{{services}}", serviceHtml)
        .replace("{{subtotal}}", total.toFixed(2))
        .replace("{{total}}", total.toFixed(2));

      const element = document.createElement("div");
      element.innerHTML = html;
      element.style.position = "fixed";
      element.style.top = "0";
      element.style.left = "0";
      element.style.zIndex = "-1";
      element.style.width = "210mm";
      element.style.background = "white";
      document.body.appendChild(element);

      const opt = {
        margin: 10,
        filename: `factura-${appointment.id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      setTimeout(() => {
        html2pdf()
          .set(opt)
          .from(element)
          .toPdf()
          .output("blob")
          .then((pdfBlob: Blob) => {
            document.body.removeChild(element);

            const telefono = appointment.user.telefono || "";
            const mensaje = encodeURIComponent(`Hola, adjunto factura de tu cita. Total: ${total} EUR.`);
            const file = new File([pdfBlob], `factura-${appointment.id}.pdf`, { type: "application/pdf" });

            if (navigator.share && navigator.canShare?.({ files: [file] })) {
              navigator.share({ files: [file], title: "Factura" }).catch(() => {
                ejecutarFallback(pdfBlob, telefono, mensaje, appointment.id);
              });
            } else {
              ejecutarFallback(pdfBlob, telefono, mensaje, appointment.id);
            }
            setIsGenerating(false);
          })
          .catch((err: any) => {
            console.error(err);
            if (document.body.contains(element)) document.body.removeChild(element);
            setIsGenerating(false);
          });
      }, 300);
    } catch (err) {
      console.error(err);
      alert("Error procesando el documento.");
      setIsGenerating(false);
    }
  };

  return { generateAndSendWhatsApp, isGenerating, isLibraryLoaded: !!html2pdf };
}