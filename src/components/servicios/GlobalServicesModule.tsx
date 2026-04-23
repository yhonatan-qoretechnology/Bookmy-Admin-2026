import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type FormEvent,
} from "react";
import styled from "styled-components";
import { FetchHttpClient } from "../../api/http/FetchHttpClient";
import {
  GlobalCategoriesApiClient,
  type Category,
} from "../../api/clients/GlobalCategoriesApiClient";
import {
  GlobalServicesApiClient,
  type Service,
} from "../../api/clients/GlobalServicesApiClient";
import { TableSearchFilter } from "../common/TableSearchFilter";

const httpClient = new FetchHttpClient();
const categoriesApi = new GlobalCategoriesApiClient(httpClient);
const servicesApi = new GlobalServicesApiClient(httpClient);

const Container = styled.div`
  padding: 1.5rem;
`;

const TabsHeader = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 2rem;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  color: ${({ $isActive, theme }) => ($isActive ? theme.primary : "#6b7280")};
  border-bottom: 3px solid
    ${({ $isActive, theme }) => ($isActive ? theme.primary : "transparent")};
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 700;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  min-height: 100px;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid #f3f4f6;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
`;

const Banner = styled.div<{ $type: "success" | "error" }>`
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-weight: 700;
  border: 1px solid
    ${({ $type }) => ($type === "success" ? "#86efac" : "#fecaca")};
  color: ${({ $type }) => ($type === "success" ? "#166534" : "#991b1b")};
  background: ${({ $type }) => ($type === "success" ? "#dcfce7" : "#fee2e2")};
`;

interface Props {
  sedeId?: number;
}

export function GlobalServicesModule({ sedeId }: Props) {
  const [activeTab, setActiveTab] = useState<"categorias" | "servicios">(
    "categorias",
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    const lower = searchTerm.toLowerCase();
    return categories.filter((c) =>
      c.translations?.some((t) => t.name?.toLowerCase().includes(lower)),
    );
  }, [categories, searchTerm]);

  const filteredServices = useMemo(() => {
    if (!searchTerm) return services;
    const lower = searchTerm.toLowerCase();
    return services.filter(
      (s) =>
        s.nombre?.toLowerCase().includes(lower) ||
        s.descripcion?.toLowerCase().includes(lower) ||
        s.categoria?.translations?.some((t) =>
          t.name?.toLowerCase().includes(lower),
        ),
    );
  }, [services, searchTerm]);

  // Pagination
  const pageSize = 10;
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [servicesPage, setServicesPage] = useState(1);

  const categoriesPaginated = filteredCategories.slice(
    (categoriesPage - 1) * pageSize,
    categoriesPage * pageSize,
  );
  const servicesPaginated = filteredServices.slice(
    (servicesPage - 1) * pageSize,
    servicesPage * pageSize,
  );

  const Pagination = ({
    currentPage,
    total,
    onPageChange,
  }: {
    currentPage: number;
    total: number;
    onPageChange: (page: number) => void;
  }) => {
    const totalPages = Math.ceil(total / pageSize);
    return (
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        <Button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Anterior
        </Button>
        <span style={{ padding: "0.5rem", fontWeight: "bold" }}>
          Página {currentPage} de {totalPages || 1}
        </span>
        <Button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Siguiente
        </Button>
      </div>
    );
  };

  const unwrapArray = useCallback((value: unknown): unknown[] => {
    if (Array.isArray(value)) return value;

    if (value && typeof value === "object") {
      const obj = value as Record<string, unknown>;
      const candidates = [
        obj.data,
        obj.items,
        obj.rows,
        obj.results,
        obj.categories,
        obj.services,
      ];

      for (const candidate of candidates) {
        if (Array.isArray(candidate)) return candidate;
      }
    }

    return [];
  }, []);

  const normalizeCategories = useCallback((items: unknown): Category[] => {
    if (!Array.isArray(items)) return [];

    return items.map((raw) => {
      const obj = raw as Record<string, unknown>;

      const translationsCandidate =
        obj.translations ??
        obj.CategoryTranslations ??
        obj.categoryTranslations ??
        obj.translationsList;

      const translations = Array.isArray(translationsCandidate)
        ? (translationsCandidate as Category["translations"])
        : [];

      const nameFallback = typeof obj.name === "string" ? obj.name : undefined;
      const descriptionFallback =
        typeof obj.description === "string" ? obj.description : undefined;

      const translationsWithFallbacks =
        translations.length > 0
          ? translations
          : nameFallback || descriptionFallback
            ? ([
                {
                  language: "es",
                  name: nameFallback ?? "",
                  description: descriptionFallback ?? "",
                },
              ] as Category["translations"])
            : [];

      const idCandidate = obj.id ?? obj.categoryId ?? obj.category_id;
      const normalizedId =
        typeof idCandidate === "number"
          ? idCandidate
          : typeof idCandidate === "string"
            ? Number(idCandidate)
            : (raw as Category).id;

      if (!Array.isArray(translationsCandidate)) {
        console.warn("Categoría con shape inesperado:", raw);
      }

      return {
        ...(raw as Category),
        id: normalizedId,
        translations: translationsWithFallbacks,
      };
    });
  }, []);

  const normalizeServices = useCallback((items: unknown): Service[] => {
    if (!Array.isArray(items)) return [];

    return items.map((raw) => {
      const obj = raw as Record<string, unknown>;
      const translationsCandidate =
        obj.translations ??
        obj.ServiceTranslations ??
        obj.serviceTranslations ??
        obj.translationsList;

      const translations = Array.isArray(translationsCandidate)
        ? (translationsCandidate as Service["translations"])
        : [];

      const nameFallback = typeof obj.name === "string" ? obj.name : undefined;
      const descriptionFallback =
        typeof obj.description === "string" ? obj.description : undefined;

      const translationsWithFallbacks =
        translations.length > 0
          ? translations
          : nameFallback || descriptionFallback
            ? ([
                {
                  language: "es",
                  name: nameFallback ?? "",
                  description: descriptionFallback ?? "",
                },
              ] as Service["translations"])
            : [];

      const prices = Array.isArray(obj.prices)
        ? (obj.prices as Service["prices"])
        : [];

      const categoryIdCandidate =
        obj.categoryId ??
        obj.category_id ??
        obj.categoriaId ??
        obj.categoria_id ??
        obj.CategoryId ??
        obj.categoryID ??
        obj.category ??
        (typeof obj.category === "object" && obj.category !== null
          ? (obj.category as Record<string, unknown>).id
          : undefined) ??
        (typeof obj.Category === "object" && obj.Category !== null
          ? (obj.Category as Record<string, unknown>).id
          : undefined);

      const normalizedCategoryId =
        typeof categoryIdCandidate === "number"
          ? categoryIdCandidate
          : typeof categoryIdCandidate === "string"
            ? Number(categoryIdCandidate)
            : (raw as Service).categoryId;

      if (
        normalizedCategoryId === undefined ||
        Number.isNaN(normalizedCategoryId)
      ) {
        console.warn("Servicio sin categoryId normalizable:", raw);
      }

      if (!Array.isArray(translationsCandidate) || !Array.isArray(obj.prices)) {
        console.warn("Servicio con shape inesperado:", raw);
      }

      return {
        ...(raw as Service),
        categoryId: normalizedCategoryId,
        translations: translationsWithFallbacks,
        prices,
      };
    });
  }, []);

  // Category Form State
  const [catNameEs, setCatNameEs] = useState("");
  const [catDescEs, setCatDescEs] = useState("");
  const [catNameEn, setCatNameEn] = useState("");
  const [catDescEn, setCatDescEn] = useState("");
  const [catAutoCopyEn, setCatAutoCopyEn] = useState(true);

  // Service Form State
  const [srvCategoryId, setSrvCategoryId] = useState("");
  const [srvNameEs, setSrvNameEs] = useState("");
  const [srvDescEs, setSrvDescEs] = useState("");
  const [srvNameEn, setSrvNameEn] = useState("");
  const [srvDescEn, setSrvDescEn] = useState("");
  const [srvAutoCopyEn, setSrvAutoCopyEn] = useState(true);
  const [srvPrice, setSrvPrice] = useState("");
  const [srvDuration, setSrvDuration] = useState("60");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [catsRes, srvsRes] = await Promise.all([
        categoriesApi.getCategories(),
        servicesApi.getServices(),
      ]);

      if (!catsRes.ok) {
        console.error(
          "Error fetching categories:",
          catsRes.status,
          catsRes.data,
        );
      }
      if (!srvsRes.ok) {
        console.error("Error fetching services:", srvsRes.status, srvsRes.data);
      }

      const catsArray = unwrapArray(catsRes.data);
      const srvsArray = unwrapArray(srvsRes.data);

      if (!Array.isArray(catsRes.data)) {
        console.warn(
          "GET /categories returned non-array data; unwrapped:",
          catsRes.data,
        );
      }
      if (!Array.isArray(srvsRes.data)) {
        console.warn(
          "GET /services returned non-array data; unwrapped:",
          srvsRes.data,
        );
      }

      setCategories(normalizeCategories(catsArray));
      setServices(normalizeServices(srvsArray));
    } catch (error) {
      console.error("Error fetching global data:", error);
    } finally {
      setLoading(false);
    }
  }, [normalizeCategories, normalizeServices, unwrapArray]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!banner) return;
    const id = window.setTimeout(() => setBanner(null), 4000);
    return () => window.clearTimeout(id);
  }, [banner]);

  const translateText = useCallback(async (text: string): Promise<string> => {
    const trimmed = text.trim();
    if (!trimmed) return "";

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=es|en`,
      );
      const data: unknown = await response.json();
      const obj = data as {
        responseStatus?: number;
        responseData?: { translatedText?: string };
      };
      const translated = obj.responseData?.translatedText;

      return typeof translated === "string" && obj.responseStatus === 200
        ? translated
        : text;
    } catch {
      return text;
    }
  }, []);

  const debounceTranslate = useCallback(
    (value: string, setter: (translated: string) => void) => {
      const timeoutId = window.setTimeout(async () => {
        const translated = await translateText(value);
        setter(translated);
      }, 450);

      return () => window.clearTimeout(timeoutId);
    },
    [translateText],
  );

  useEffect(() => {
    if (!catAutoCopyEn) return;
    return debounceTranslate(catNameEs, setCatNameEn);
  }, [catNameEs, catAutoCopyEn, debounceTranslate]);

  useEffect(() => {
    if (!catAutoCopyEn) return;
    return debounceTranslate(catDescEs, setCatDescEn);
  }, [catDescEs, catAutoCopyEn, debounceTranslate]);

  useEffect(() => {
    if (!srvAutoCopyEn) return;
    return debounceTranslate(srvNameEs, setSrvNameEn);
  }, [srvNameEs, srvAutoCopyEn, debounceTranslate]);

  useEffect(() => {
    if (!srvAutoCopyEn) return;
    return debounceTranslate(srvDescEs, setSrvDescEn);
  }, [srvDescEs, srvAutoCopyEn, debounceTranslate]);

  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const nameEnToSend = catAutoCopyEn
        ? await translateText(catNameEs)
        : catNameEn;
      const descEnToSend = catAutoCopyEn
        ? await translateText(catDescEs)
        : catDescEn;

      const response = await categoriesApi.createCategory({
        image: null,
        translations: [
          { language: "es", name: catNameEs, description: catDescEs },
          { language: "en", name: nameEnToSend, description: descEnToSend },
        ],
      });

      if (!response.ok) {
        console.error(
          "Error creating category:",
          response.status,
          response.data,
        );
        setBanner({ type: "error", text: "No se pudo crear la categoría" });
        return;
      }

      setCatNameEs("");
      setCatDescEs("");
      setCatNameEn("");
      setCatDescEn("");
      setCategoriesPage(1); // Reset to first page after creation
      setBanner({ type: "success", text: "Categoría creada correctamente" });
      fetchData();
    } catch (error) {
      console.error("Error creating category:", error);
      setBanner({ type: "error", text: "No se pudo crear la categoría" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e: FormEvent) => {
    e.preventDefault();
    if (!srvCategoryId) return;
    setLoading(true);
    try {
      const nameEnToSend = srvAutoCopyEn
        ? await translateText(srvNameEs)
        : srvNameEn;
      const descEnToSend = srvAutoCopyEn
        ? await translateText(srvDescEs)
        : srvDescEn;

      const payload = {
        categoryId: Number(srvCategoryId),
        translations: [
          { language: "es", name: srvNameEs, description: srvDescEs },
          { language: "en", name: nameEnToSend, description: descEnToSend },
        ],
        prices: [
          {
            amount: Number.parseFloat(srvPrice),
            duration: Number(srvDuration),
            currency: "EUR",
          },
        ],
        sedeIds: typeof sedeId === "number" ? [sedeId] : [],
      };

      const response = await servicesApi.createService(payload);

      if (!response.ok) {
        console.error(
          "Error creating service:",
          response.status,
          response.data,
        );
        setBanner({ type: "error", text: "No se pudo crear el servicio" });
        return;
      }

      setSrvNameEs("");
      setSrvDescEs("");
      setSrvNameEn("");
      setSrvDescEn("");
      setSrvPrice("");
      setServicesPage(1); // Reset to first page after creation
      setBanner({ type: "success", text: "Servicio creado correctamente" });
      fetchData();
    } catch (error) {
      console.error("Error creating service:", error);
      setBanner({ type: "error", text: "No se pudo crear el servicio" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <TabsHeader>
        <TabButton
          $isActive={activeTab === "categorias"}
          onClick={() => setActiveTab("categorias")}
        >
          Categorías Globales
        </TabButton>
        <TabButton
          $isActive={activeTab === "servicios"}
          onClick={() => setActiveTab("servicios")}
        >
          Servicios Globales
        </TabButton>
      </TabsHeader>

      <TableSearchFilter
        searchPlaceholder={`Buscar ${activeTab === "categorias" ? "categorías" : "servicios"}...`}
        onSearch={setSearchTerm}
      />

      <ContentCard>
        {banner && <Banner $type={banner.type}>{banner.text}</Banner>}
        {activeTab === "categorias" ? (
          <>
            <h3>Nueva Categoría</h3>
            <Form onSubmit={handleCreateCategory}>
              <FormGroup>
                <Label>Nombre (ES)</Label>
                <Input
                  required
                  value={catNameEs}
                  onChange={(e) => setCatNameEs(e.target.value)}
                  placeholder="Ej. Yoga"
                />
              </FormGroup>
              <FormGroup>
                <Label>Descripción (ES)</Label>
                <TextArea
                  required
                  value={catDescEs}
                  onChange={(e) => setCatDescEs(e.target.value)}
                  placeholder="Descripción de la categoría..."
                />
              </FormGroup>
              <FormGroup>
                <Label>
                  <input
                    type="checkbox"
                    checked={catAutoCopyEn}
                    onChange={(e) => setCatAutoCopyEn(e.target.checked)}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Traducir ES a EN automáticamente
                </Label>
              </FormGroup>
              <FormGroup>
                <Label>Nombre (EN)</Label>
                <Input
                  required={!catAutoCopyEn}
                  disabled={catAutoCopyEn}
                  value={catNameEn}
                  onChange={(e) => setCatNameEn(e.target.value)}
                  placeholder="E.g. Yoga"
                />
              </FormGroup>
              <FormGroup>
                <Label>Descripción (EN)</Label>
                <TextArea
                  required={!catAutoCopyEn}
                  disabled={catAutoCopyEn}
                  value={catDescEn}
                  onChange={(e) => setCatDescEn(e.target.value)}
                  placeholder="Category description..."
                />
              </FormGroup>
              <Button type="submit" disabled={loading}>
                Guardar Categoría
              </Button>
            </Form>

            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Nombre</Th>
                  <Th>Descripción</Th>
                </tr>
              </thead>
              <tbody>
                {categoriesPaginated.map((cat) => (
                  <tr key={cat.id}>
                    <Td>{cat.id}</Td>
                    <Td>
                      {cat.translations?.find((t) => t.language === "es")
                        ?.name ?? `Categoría ${cat.id}`}
                    </Td>
                    <Td>
                      {cat.translations?.find((t) => t.language === "es")
                        ?.description ?? "N/A"}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination
              currentPage={categoriesPage}
              total={categories.length}
              onPageChange={setCategoriesPage}
            />
          </>
        ) : (
          <>
            <h3>Nuevo Servicio Global</h3>
            <Form onSubmit={handleCreateService}>
              <FormGroup>
                <Label>Categoría</Label>
                <Select
                  required
                  value={srvCategoryId}
                  onChange={(e) => setSrvCategoryId(e.target.value)}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.translations?.find((t) => t.language === "es")
                        ?.name ?? `Categoría ${cat.id}`}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Nombre del Servicio (ES)</Label>
                <Input
                  required
                  value={srvNameEs}
                  onChange={(e) => setSrvNameEs(e.target.value)}
                  placeholder="Ej. Yoga Vinyasa"
                />
              </FormGroup>
              <FormGroup>
                <Label>Descripción (ES)</Label>
                <TextArea
                  required
                  value={srvDescEs}
                  onChange={(e) => setSrvDescEs(e.target.value)}
                  placeholder="Descripción del servicio..."
                />
              </FormGroup>
              <FormGroup>
                <Label>
                  <input
                    type="checkbox"
                    checked={srvAutoCopyEn}
                    onChange={(e) => setSrvAutoCopyEn(e.target.checked)}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Traducir ES a EN automáticamente
                </Label>
              </FormGroup>
              <FormGroup>
                <Label>Nombre del Servicio (EN)</Label>
                <Input
                  required={!srvAutoCopyEn}
                  disabled={srvAutoCopyEn}
                  value={srvNameEn}
                  onChange={(e) => setSrvNameEn(e.target.value)}
                  placeholder="E.g. Vinyasa Yoga"
                />
              </FormGroup>
              <FormGroup>
                <Label>Descripción (EN)</Label>
                <TextArea
                  required={!srvAutoCopyEn}
                  disabled={srvAutoCopyEn}
                  value={srvDescEn}
                  onChange={(e) => setSrvDescEn(e.target.value)}
                  placeholder="Service description..."
                />
              </FormGroup>
              <div style={{ display: "flex", gap: "1rem" }}>
                <FormGroup style={{ flex: 1 }}>
                  <Label>Precio (EUR)</Label>
                  <Input
                    type="number"
                    required
                    value={srvPrice}
                    onChange={(e) => setSrvPrice(e.target.value)}
                    placeholder="40"
                  />
                </FormGroup>
                <FormGroup style={{ flex: 1 }}>
                  <Label>Duración (min)</Label>
                  <Input
                    type="number"
                    required
                    value={srvDuration}
                    onChange={(e) => setSrvDuration(e.target.value)}
                    placeholder="60"
                  />
                </FormGroup>
              </div>
              <Button type="submit" disabled={loading || !srvCategoryId}>
                Guardar Servicio
              </Button>
            </Form>

            <Table>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Nombre</Th>
                  <Th>Categoría ID</Th>
                  <Th>Precio</Th>
                </tr>
              </thead>
              <tbody>
                {servicesPaginated.map((srv) => (
                  <tr key={srv.id}>
                    <Td>{srv.id}</Td>
                    <Td>
                      {srv.translations?.find((t) => t.language === "es")
                        ?.name ?? "N/A"}
                    </Td>
                    <Td>
                      {(() => {
                        const categoryId =
                          typeof srv.categoryId === "number"
                            ? srv.categoryId
                            : typeof srv.categoryId === "string"
                              ? Number(srv.categoryId)
                              : undefined;

                        const catFromList =
                          typeof categoryId === "number" &&
                          !Number.isNaN(categoryId)
                            ? categories.find((c) => c.id === categoryId)
                            : undefined;

                        if (catFromList) {
                          return (
                            catFromList.translations?.find(
                              (t) => t.language === "es",
                            )?.name ?? `Categoría ${catFromList.id}`
                          );
                        }

                        const srvAny = srv as unknown as Record<
                          string,
                          unknown
                        >;
                        const embeddedCategory =
                          (typeof srvAny.category === "object" &&
                          srvAny.category !== null
                            ? (srvAny.category as Record<string, unknown>)
                            : undefined) ??
                          (typeof srvAny.Category === "object" &&
                          srvAny.Category !== null
                            ? (srvAny.Category as Record<string, unknown>)
                            : undefined);

                        const embeddedTranslationsCandidate =
                          embeddedCategory?.translations;
                        const embeddedTranslations = Array.isArray(
                          embeddedTranslationsCandidate,
                        )
                          ? (embeddedTranslationsCandidate as Array<
                              Record<string, unknown>
                            >)
                          : [];

                        const embeddedEs = embeddedTranslations.find(
                          (t) => t.language === "es",
                        );
                        const embeddedName =
                          embeddedEs && typeof embeddedEs.name === "string"
                            ? embeddedEs.name
                            : undefined;

                        if (embeddedName) return embeddedName;

                        return typeof categoryId === "number" &&
                          !Number.isNaN(categoryId)
                          ? `Categoría ${categoryId}`
                          : "N/A";
                      })()}
                    </Td>
                    <Td>
                      {srv.prices?.[0]?.amount} {srv.prices?.[0]?.currency}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination
              currentPage={servicesPage}
              total={services.length}
              onPageChange={setServicesPage}
            />
          </>
        )}
      </ContentCard>
    </Container>
  );
}
