// InvoiceTemplate.tsx

interface Service {
  name: string;
  qty: number;
  price: number;
  total: number;
}

interface InvoiceProps {
  invoiceNumber: string;
  date: string;
  clientName: string;
  sede: string;
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  qrUrl?: string;
  services: Service[];
}

export default function InvoiceTemplate({
  invoiceNumber,
  date,
  clientName,
  sede,
  subtotal,
  tax = 0,
  discount = 0,
  total,
  qrUrl,
  services,
}: InvoiceProps) {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-gray-900 p-10">
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Glow Experience
            </h1>

            <p className="text-slate-300 mt-2">Facturación electrónica</p>
          </div>

          <div className="text-right">
            <div className="text-sm uppercase text-slate-400">Factura</div>

            <div className="text-2xl font-bold">#{invoiceNumber}</div>

            <div className="mt-4 text-sm">Fecha: {date}</div>
          </div>
        </div>
      </div>

      {/* Cliente */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-xs uppercase text-gray-500 mb-2">Cliente</p>

          <h2 className="text-xl font-bold">{clientName}</h2>

          <p className="text-gray-600 mt-1">{sede}</p>
        </div>

        <div className="flex justify-end">
          {qrUrl && <img src={qrUrl} alt="QR" className="w-28 h-28" />}
        </div>
      </div>

      {/* Tabla */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 bg-slate-900 text-white text-sm font-semibold p-4">
          <div className="col-span-6">Descripción</div>
          <div className="col-span-2 text-center">Cant.</div>
          <div className="col-span-2 text-right">Precio</div>
          <div className="col-span-2 text-right">Total</div>
        </div>

        {services.map((service, index) => (
          <div
            key={index}
            className="grid grid-cols-12 p-4 border-b border-gray-100 text-sm"
          >
            <div className="col-span-6">{service.name}</div>

            <div className="col-span-2 text-center">{service.qty}</div>

            <div className="col-span-2 text-right">
              €{service.price.toFixed(2)}
            </div>

            <div className="col-span-2 text-right font-medium">
              €{service.total.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="flex justify-end mt-8">
        <div className="w-[340px]">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="flex justify-between mb-3">
              <span className="text-gray-500">Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span className="text-gray-500">IVA</span>
              <span>€{tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-4">
              <span className="text-gray-500">Descuento</span>
              <span>-€{discount.toFixed(2)}</span>
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-lg font-semibold">TOTAL</span>

              <span className="text-3xl font-bold text-slate-900">
                €{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 border-t pt-8">
        <div className="grid grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Glow Experience</h3>

            <p className="text-gray-500">Sede Benalmádena</p>

            <p className="text-gray-500">info@byglow.es</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Información</h3>

            <p className="text-gray-500">
              Documento generado electrónicamente.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Soporte</h3>

            <p className="text-gray-500">www.byglow.es</p>
          </div>
        </div>
      </div>
    </div>
  );
}
