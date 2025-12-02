// src/components/admin/TutorsManager.tsx
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import {
  fetchTutores,
  createTutor,
  deleteTutor,
  TutorRow,
} from "../../lib/api";

export function TutorsManager() {
  const [tutores, setTutores] = useState<TutorRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTutores = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTutores();
      setTutores(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al cargar tutores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutores();
  }, []);

  const handleCreate = async () => {
    try {
      setCreating(true);
      setError(null);
      const nuevo = await createTutor();
      setTutores((prev) => [...prev, nuevo]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al crear tutor");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id_tutor: number) => {
    const ok = window.confirm(
      `¿Seguro que quieres eliminar el tutor #${id_tutor}?`
    );
    if (!ok) return;

    try {
      setDeletingId(id_tutor);
      setError(null);
      await deleteTutor(id_tutor);
      setTutores((prev) => prev.filter((t) => t.id_tutor !== id_tutor));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al eliminar tutor");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Gestión de Tutores</h2>
          <p className="text-gray-600 mt-1">
            Administrar registros de tutores del programa GLOBALENGLISH
          </p>
          {error && (
            <p className="text-sm text-red-500 mt-2">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={loadTutores}
            disabled={loading}
            title="Refrescar lista"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={handleCreate} disabled={creating}>
            <Plus className="w-4 h-4 mr-2" />
            {creating ? "Creando..." : "Nuevo Tutor"}
          </Button>
        </div>
      </div>

      {/* Lista de tutores */}
      <Card>
        <CardHeader>
          <CardTitle>Tutores Registrados</CardTitle>
          <CardDescription>
            {loading
              ? "Cargando tutores..."
              : `${tutores.length} tutor(es) encontrados`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tutores.length === 0 && !loading ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">Aún no hay tutores registrados.</p>
              <p className="text-sm">
                Usa el botón <strong>“Nuevo Tutor”</strong> para crear el
                primero.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Tutor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tutores.map((tutor) => (
                  <TableRow key={tutor.id_tutor}>
                    <TableCell>#{tutor.id_tutor}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Activo</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(tutor.id_tutor)}
                        disabled={deletingId === tutor.id_tutor}
                        title="Eliminar tutor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// (opcional) también lo exportamos por defecto
export default TutorsManager;
