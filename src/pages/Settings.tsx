import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext"; // Import useTheme
import { useTranslation } from "react-i18next";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme(); // Use the theme hook
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('settings_page.title')}</CardTitle>
          <CardDescription>{t('settings_page.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme-switch">{t('settings_page.dark_mode')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings_page.toggle_theme')}
              </p>
            </div>
            <Switch 
              id="theme-switch" 
              checked={theme === 'dark'} // Set checked based on current theme
              onCheckedChange={toggleTheme} // Toggle theme on change
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="newsletter-switch">{t('settings_page.newsletter')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings_page.subscribe_newsletter')}
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