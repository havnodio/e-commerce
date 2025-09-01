import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SettingsPage = () => {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Gérez les paramètres de votre application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme-switch">Mode Sombre</Label>
              <p className="text-sm text-muted-foreground">
                Basculez entre les thèmes clair et sombre.
              </p>
            </div>
            <Switch id="theme-switch" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="newsletter-switch">Newsletter</Label>
              <p className="text-sm text-muted-foreground">
                Abonnez-vous à notre newsletter hebdomadaire.
              </p>
            </div>
            <Switch id="newsletter-switch" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;