import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AccountPage = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Mon Compte</CardTitle>
          <CardDescription>Gérez les informations de votre profil.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" placeholder="Entrez votre prénom" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" placeholder="Entrez votre nom" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Entrez votre email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input id="newPassword" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Enregistrer les modifications</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccountPage;