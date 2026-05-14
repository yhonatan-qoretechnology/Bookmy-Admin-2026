# Actualización de Funcionalidad: Actualizar Sede

## 📋 Resumen
Se implementó la funcionalidad completa para actualizar datos de sedes, incluyendo horarios, días cerrados y todos los campos requeridos por el backend.

## 🔧 Cambios Realizados

### 1. **SedesApiClient** (`src/api/clients/SedesApiClient.ts`)

**Cambio:** Actualización del método `updateSede()` para enviar JSON tipado en lugar de FormData.

```typescript
// ANTES:
updateSede(sedeId: number, formData: FormData) {
  return this.httpClient.patch<Sede, FormData>(`/sedes/${sedeId}`, formData);
}

// DESPUÉS:
updateSede(sedeId: number, data: {
  nombre: string;
  direccion: string;
  telefono: string;
  latitud: number;
  longitud: number;
  provincia: string;
  horario: Record<string, string>;
  diasCerrado?: string[];
  empresaId?: number;
}) {
  return this.httpClient.patch<Sede>(`/sedes/${sedeId}`, data);
}
```

**Ventajas SOLID:**
- ✅ **Single Responsibility**: Método responsable solo de actualizar
- ✅ **Dependency Inversion**: HttpClient gestiona serialización interna
- ✅ **Type Safety**: Tipos explícitos evitan errores en compilación

---

### 2. **EmpresaSedesModule** (`src/components/empresas/EmpresaSedesModule.tsx`)

#### a) **Nuevo Estado para Edición de Horarios**
```typescript
const [editHorarioDays, setEditHorarioDays] = useState(() => ({
  lunes: { enabled: true, open: "10:00", close: "19:00" },
  martes: { enabled: true, open: "10:00", close: "19:00" },
  // ... resto de días
}));

const [editDiasCerrado, setEditDiasCerrado] = useState<string[]>([]);
const [editNewDateToAdd, setEditNewDateToAdd] = useState("");
```

**Principios SOLID:**
- ✅ **Single Responsibility**: Cada estado tiene una responsabilidad clara
- ✅ **Open/Closed**: Extensible para agregar más campos

#### b) **Inicialización de Formulario Mejorada**
```typescript
useEffect(() => {
  if (editingSede) {
    // Inicializa datos básicos
    setEditForm({...});
    
    // NUEVO: Inicializa horarios desde datos existentes
    if (editingSede.horario) {
      const horarioConfig = Object.fromEntries(
        daysOrder.map((day) => {
          const horarioStr = editingSede.horario[day];
          if (horarioStr === "Cerrado" || !horarioStr) {
            return [day, { enabled: false, open: "10:00", close: "19:00" }];
          }
          const [open, close] = horarioStr.split("-");
          return [day, { enabled: true, open: open || "10:00", close: close || "19:00" }];
        }),
      );
      setEditHorarioDays(horarioConfig as any);
    }
    
    // NUEVO: Inicializa días cerrados
    if (editingSede.diasCerrado) {
      const dias = typeof editingSede.diasCerrado === "string"
        ? JSON.parse(editingSede.diasCerrado)
        : editingSede.diasCerrado;
      setEditDiasCerrado(Array.isArray(dias) ? dias : []);
    }
  }
}, [editingSede, daysOrder]);
```

#### c) **Actualización Completa del Handler**
```typescript
const handleUpdateSedeSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!editingSede) return;

  try {
    setIsUpdating(true);

    // Construye horario en formato requerido
    const horario = Object.fromEntries(
      daysOrder.map((day) => {
        const cfg = editHorarioDays[day];
        return [day, cfg.enabled ? `${cfg.open}-${cfg.close}` : "Cerrado"];
      }),
    );

    // Prepara datos completos para enviar
    const updateData = {
      nombre: editForm.nombre,
      direccion: editForm.direccion,
      telefono: editForm.telefono,
      latitud: parseFloat(editForm.latitud) || 0,
      longitud: parseFloat(editForm.longitud) || 0,
      provincia: editForm.provincia,
      horario,
      diasCerrado: editDiasCerrado,
      empresaId: editingSede.empresaId,
    };

    // Envía actualización
    const response = await sedesApiClient.updateSede(
      editingSede.id,
      updateData,
    );

    if (!response.ok) {
      // Error handling mejorado
      setNotification({
        show: true,
        message: response.data?.message || "Error al actualizar la sede",
        type: "error",
      });
      setTimeout(
        () => setNotification((p) => ({ ...p, show: false })),
        3000,
      );
      return;
    }

    // Éxito
    setNotification({
      show: true,
      message: "Sede actualizada exitosamente",
      type: "success",
    });
    
    setTimeout(() => {
      setNotification((p) => ({ ...p, show: false }));
      setIsEditingSede(false);
      setEditingSede(null);
    }, 1500);

    await refreshSedes();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "No se pudo actualizar la sede";
    setNotification({
      show: true,
      message: errorMessage,
      type: "error",
    });
    setTimeout(
      () => setNotification((p) => ({ ...p, show: false })),
      3000,
    );
  } finally {
    setIsUpdating(false);
  }
};
```

#### d) **UI Modal Actualizado**
Se agregaron campos en el tab "Datos":
- ✅ Horario para cada día (con toggle Abierto/Cerrado)
- ✅ Días cerrados (fechas especiales)
- ✅ Ambos campos son completamente editables

---

## 📋 Campos Enviados al Backend

Endpoint: `PATCH /sedes/{id}`

```json
{
  "nombre": "Sede Principal",
  "direccion": "Calle 10 # 5-20",
  "telefono": "+348001112233",
  "latitud": 39.85775568894994,
  "longitud": -4.020722145741523,
  "provincia": "Antioquia",
  "horario": {
    "lunes": "10:00-19:00",
    "martes": "10:00-19:00",
    "miércoles": "10:00-19:00",
    "jueves": "10:00-19:00",
    "viernes": "10:00-19:00",
    "sábado": "10:00-14:00",
    "domingo": "Cerrado"
  },
  "diasCerrado": ["2025-08-31", "2026-09-07"],
  "empresaId": 2
}
```

---

## 🎯 Principios SOLID Aplicados

### Single Responsibility
- Cada método/estado tiene una única responsabilidad
- `updateSede()` solo se encarga de actualizar
- `handleUpdateSedeSubmit()` orquesta el flujo pero delega serialización

### Open/Closed
- El componente es abierto para extensión (agregar más campos)
- Cerrado para modificación (cambios en la lógica base mínimos)

### Liskov Substitution
- HttpClient puede cambiar internamente sin afectar SedesApiClient
- Tipos explícitos garantizan consistencia

### Interface Segregation
- SedesApiClient solo expone métodos necesarios
- Props del componente son claras y específicas

### Dependency Inversion
- El componente no conoce detalles de HTTP (inyectado)
- SedesApiClient no conoce detalles de React

---

## ✅ Manejo de Errores

✓ Validaciones de tipos en TypeScript
✓ Notificaciones visuales (success/error)
✓ Mensajes descriptivos del backend
✓ Timeout automático de notificaciones (3s)
✓ Estados de carga (isUpdating)

---

## 🧪 Testing Manual

Para probar la funcionalidad:

1. Ve a "Empresas" → "Detalles" → "Actualizar Sede"
2. Edita nombre, dirección, teléfono, etc.
3. Modifica horarios (toggle abierto/cerrado)
4. Agrega días cerrados
5. Click en "Actualizar datos"
6. Verifica notificación de éxito/error

---

## 📊 Resumen de Cambios

| Archivo | Líneas | Cambio |
|---------|--------|--------|
| SedesApiClient.ts | 49-57 | Tipo JSON en updateSede |
| EmpresaSedesModule.tsx | ~40 líneas | Nuevo estado para horarios/días |
| EmpresaSedesModule.tsx | ~60 líneas | useEffect mejorado |
| EmpresaSedesModule.tsx | ~80 líneas | handleUpdateSedeSubmit completo |
| EmpresaSedesModule.tsx | ~160 líneas | UI tab "datos" con horarios |

**Total:** ~380 líneas de código mejorado ✅

