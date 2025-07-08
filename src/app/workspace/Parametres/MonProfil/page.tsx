"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';

const mockUser = {
  firstName: 'Jean',
  lastName: 'Martin',
  email: 'jean.martin@example.com',
  department: 'Développement',
  position: 'Développeur Fullstack',
  avatar: null
};

export default function MonProfilSidebarPage() {
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState(mockUser);
  const [form, setForm] = useState(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser(form);
    setEdit(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 flex items-center justify-center p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Mon Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6">
            {/* Avatar */}
            <div className="avatar placeholder mb-2">
              <div className="bg-gradient-to-r from-primary to-secondary text-primary-content rounded-full w-24 h-24 flex items-center justify-center text-3xl font-bold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
            </div>
            {/* Infos */}
            <div className="w-full space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="w-32 text-base-content/70">Prénom :</span>
                {edit ? (
                  <input name="firstName" value={form.firstName} onChange={handleChange} className="input input-bordered flex-1" />
                ) : (
                  <span className="font-medium">{user.firstName}</span>
                )}
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="w-32 text-base-content/70">Nom :</span>
                {edit ? (
                  <input name="lastName" value={form.lastName} onChange={handleChange} className="input input-bordered flex-1" />
                ) : (
                  <span className="font-medium">{user.lastName}</span>
                )}
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="w-32 text-base-content/70">Email :</span>
                {edit ? (
                  <input name="email" value={form.email} onChange={handleChange} className="input input-bordered flex-1" />
                ) : (
                  <span className="font-medium">{user.email}</span>
                )}
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="w-32 text-base-content/70">Département :</span>
                {edit ? (
                  <input name="department" value={form.department} onChange={handleChange} className="input input-bordered flex-1" />
                ) : (
                  <span className="font-medium">{user.department}</span>
                )}
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="w-32 text-base-content/70">Poste :</span>
                {edit ? (
                  <input name="position" value={form.position} onChange={handleChange} className="input input-bordered flex-1" />
                ) : (
                  <span className="font-medium">{user.position}</span>
                )}
              </div>
            </div>
            {/* Actions */}
            <div className="flex gap-3 mt-6">
              {edit ? (
                <>
                  <Button onClick={handleSave} variant="primary">Enregistrer</Button>
                  <Button onClick={() => { setEdit(false); setForm(user); }} variant="ghost">Annuler</Button>
                </>
              ) : (
                <Button onClick={() => setEdit(true)} variant="primary">Modifier</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 