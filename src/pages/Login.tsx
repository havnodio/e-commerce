import React, { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { showSuccess, showError } from '@/utils/toast';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password || !firstName || !lastName || !phoneNumber) {
      showError(t('contact_section.fill_all_fields'));
      setLoading(false);
      return;
    }

    if (phoneNumber && !/^\d{8}$/.test(phoneNumber)) {
      showError(t('account_page.phone_number_format_error'));
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        showSuccess("Veuillez vérifier votre e-mail pour confirmer votre compte.");
      } else {
        showSuccess(t('account_page.profile_updated_success'));
        navigate('/');
      }

      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setPhoneNumber('');

    } catch (error: any) {
      console.error('Sign up error:', error);
      showError(error.message || "Échec de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-gray-900 to-blue-800 items-center justify-center p-12 text-left text-white">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-4">{t('login_page.welcome')}</h1>
          <p className="text-xl">{t('login_page.start_journey')}</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm text-gray-800">
          <div className="text-center mb-8 lg:hidden">
            <Link to="/" className="text-3xl font-bold text-gray-800">
              {t('login_page.gusto_glub')}
            </Link>
          </div>

          <Tabs defaultValue="signIn" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signIn">{t('header.login')}</TabsTrigger>
              <TabsTrigger value="signUp">{t('header.signup')}</TabsTrigger>
            </TabsList>
            <TabsContent value="signIn">
              <Card>
                <CardHeader>
                  <CardTitle>{t('header.login')}</CardTitle>
                  <CardDescription>{t('login_page.start_journey')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Auth
                    supabaseClient={supabase}
                    providers={['google']}
                    appearance={{
                      theme: ThemeSupa,
                      variables: {
                        default: {
                          colors: {
                            brand: '#2563eb', // blue-600
                            brandAccent: '#1d4ed8', // blue-700
                          },
                          radii: {
                            borderRadius: '0.5rem',
                            buttonBorderRadius: '0.5rem',
                          }
                        },
                      },
                    }}
                    theme="light"
                    localization={{
                      variables: {
                        sign_in: {
                          email_label: t('account_page.email'),
                          password_label: t('account_page.current_password'),
                          button_label: t('header.login'),
                          social_provider_text: t('sign_in.social_provider_text', { provider: '{{provider}}' }),
                          link_text: t('sign_in.link_text'),
                        },
                        sign_up: {
                          email_label: t('account_page.email'),
                          password_label: t('account_page.new_password'),
                          button_label: t('sign_up.button_label'),
                          social_provider_text: t('sign_up.social_provider_text', { provider: '{{provider}}' }),
                          link_text: t('sign_up.link_text'),
                        },
                        forgotten_password: {
                          email_label: t('account_page.email'),
                          button_label: t('forgotten_password.button_label'),
                          link_text: t('forgotten_password.link_text'),
                        },
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="signUp">
              <Card>
                <CardHeader>
                  <CardTitle>{t('sign_up.button_label')}</CardTitle>
                  <CardDescription>{t('login_page.start_journey')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">{t('account_page.email')}</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">{t('account_page.new_password')}</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-firstName">{t('account_page.first_name')}</Label>
                        <Input
                          id="signup-firstName"
                          placeholder={t('account_page.enter_first_name')}
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-lastName">{t('account_page.last_name')}</Label>
                        <Input
                          id="signup-lastName"
                          placeholder={t('account_page.enter_last_name')}
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phoneNumber">{t('account_page.phone_number')}</Label>
                      <Input
                        id="signup-phoneNumber"
                        type="tel"
                        placeholder={t('account_page.enter_phone_number')}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        maxLength={8}
                        required
                      />
                      {phoneNumber && !/^\d{8}$/.test(phoneNumber) && (
                        <p className="text-sm text-red-500">{t('account_page.phone_number_format_error')}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? t('account_page.saving') : t('sign_up.button_label')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;