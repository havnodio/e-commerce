import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AccountPage = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error('Error fetching profile:', error);
          showError("Erreur lors de la récupération de votre profil.");
        } else if (data) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setAvatarUrl(data.avatar_url || '');
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Vous devez sélectionner une image à télécharger.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!data.publicUrl) {
        throw new Error("Impossible d'obtenir l'URL publique de l'avatar.");
      }
      
      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      showSuccess("Avatar mis à jour avec succès !");
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      showError(error.message || "Erreur lors du téléchargement de l'avatar.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ 
        first_name: firstName, 
        last_name: lastName, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', user.id);

    if (error) {
      showError("Erreur lors de la mise à jour du profil.");
    } else {
      showSuccess("Profil mis à jour avec succès !");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) {
        showError("Utilisateur non trouvé.");
        return;
    }
    if (!currentPassword || !newPassword) {
        showError("Veuillez remplir tous les champs de mot de passe.");
        return;
    }
    if (newPassword.length < 6) {
        showError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
        return;
    }

    setUpdatingPassword(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      showError("Le mot de passe actuel est incorrect.");
      setUpdatingPassword(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      showError("Erreur lors de la mise à jour du mot de passe.");
    } else {
      showSuccess("Mot de passe mis à jour avec succès !");
      setCurrentPassword('');
      setNewPassword('');
    }
    setUpdatingPassword(false);
  };

  if (loading) {
    return <div className="container mx-auto py-12 text-center">Chargement du profil...</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Mon Profil</CardTitle>
            <CardDescription>Gérez les informations de votre profil.</CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdateProfile}>
            <CardContent className="space-y-6">
               <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl || 'https://www.svgrepo.com/show/492676/avatar-boy.svg'} alt="User avatar" />
                  <AvatarFallback>
                    {firstName?.charAt(0).toUpperCase()}{lastName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="w-full space-y-2">
                    <Label htmlFor="avatarUpload">Changer d'avatar</Label>
                    <Input 
                        id="avatarUpload" 
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={uploadAvatar}
                        disabled={uploading}
                    />
                    {uploading && <p className="text-sm text-gray-500">Téléchargement en cours...</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user?.email || ''} disabled />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Entrez votre prénom" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Entrez votre nom" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Enregistrer les modifications</Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Changer le mot de passe</CardTitle>
            <CardDescription>Mettez à jour votre mot de passe ici.</CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdatePassword}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={updatingPassword}>
                {updatingPassword ? 'Mise à jour...' : 'Changer le mot de passe'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AccountPage;