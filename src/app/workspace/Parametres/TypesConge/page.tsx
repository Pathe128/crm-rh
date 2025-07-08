"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';

interface LeaveType {
  id: number;
  name: string;
  description?: string;
  annualQuota: number;
  remuneration: boolean;
}

const mockTypes: LeaveType[] = [
  { id: 1, name: 'Congé payé', description: 'Congé annuel rémunéré', annualQuota: 25, remuneration: true },
  { id: 2, name: 'Maladie', description: 'Arrêt maladie', annualQuota: 10, remuneration: false },
  { id: 3, name: 'RTT', description: 'Réduction du temps de travail', annualQuota: 8, remuneration: true },
];

export default function TypesCongePage() {
  const [types, setTypes] = useState<LeaveType[]>(mockTypes);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<LeaveType>>({ name: '', description: '', annualQuota: 0, remuneration: false });
  const [editId, setEditId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAdd = () => {
    if (!form.name || !form.annualQuota) return;
    setTypes([...types, { ...form, id: Date.now(), annualQuota: Number(form.annualQuota), remuneration: !!form.remuneration } as LeaveType]);
    setForm({ name: '', description: '', annualQuota: 0, remuneration: false });
    setShowForm(false);
  };

  const handleEdit = (type: LeaveType) => {
    setEditId(type.id);
    setForm(type);
    setShowForm(true);
  };

  const handleSaveEdit = () => {
    setTypes(types.map(t => t.id === editId ? { ...form, id: editId, annualQuota: Number(form.annualQuota), remuneration: !!form.remuneration } as LeaveType : t));
    setEditId(null);
    setForm({ name: '', description: '', annualQuota: 0, remuneration: false });
    setShowForm(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Supprimer ce type de congé ?')) setTypes(types.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-6 flex items-center justify-center">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Types de congé</CardTitle>
            <Button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', description: '', annualQuota: 0, remuneration: false }); }} variant="primary">Ajouter</Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6 p-4 bg-base-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Nom *</label>
                  <input name="name" value={form.name} onChange={handleChange} className="input input-bordered w-full" required />
                </div>
                <div>
                  <label className="label">Description</label>
                  <input name="description" value={form.description} onChange={handleChange} className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="label">Quota annuel *</label>
                  <input name="annualQuota" type="number" min={0} value={form.annualQuota} onChange={handleChange} className="input input-bordered w-full" required />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input name="remuneration" type="checkbox" checked={!!form.remuneration} onChange={handleChange} className="checkbox" />
                  <span>Rémunéré</span>
                </div>
              </div>
              <div className="flex gap-3">
                {editId ? (
                  <Button onClick={handleSaveEdit} variant="primary">Enregistrer</Button>
                ) : (
                  <Button onClick={handleAdd} variant="primary">Ajouter</Button>
                )}
                <Button onClick={() => { setShowForm(false); setEditId(null); setForm({ name: '', description: '', annualQuota: 0, remuneration: false }); }} variant="ghost">Annuler</Button>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200">
                  <th>Nom</th>
                  <th>Description</th>
                  <th>Quota annuel</th>
                  <th>Rémunération</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {types.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-base-content/60">Aucun type de congé</td></tr>
                ) : types.map(type => (
                  <tr key={type.id} className="hover:bg-base-100">
                    <td className="font-medium">{type.name}</td>
                    <td>{type.description}</td>
                    <td>{type.annualQuota}</td>
                    <td>{type.remuneration ? 'Oui' : 'Non'}</td>
                    <td>
                      <Button onClick={() => handleEdit(type)} variant="ghost" className="mr-2">Modifier</Button>
                      <Button onClick={() => handleDelete(type.id)} variant="accent">Supprimer</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 