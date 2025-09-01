import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const LoginPage = () => {
  const { session } = useAuth();

  useEffect(() => {
    // Optional: Add any logic needed on component mount or session change
  }, [session]);

  if (session) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-stretch">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-gray-900 to-blue-800 items-center justify-center p-12 text-left text-white">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-4">Bienvenue</h1>
          <p className="text-xl">Commencez votre voyage avec nous dès maintenant.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm text-gray-800">
          <div className="text-center mb-8 lg:hidden">
            <Link to="/" className="text-3xl font-bold text-gray-800">
              Gusto Glub
            </Link>
          </div>
          <Auth
            supabaseClient={supabase}
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
            providers={['google']}
            theme="light"
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Adresse e-mail',
                  password_label: 'Mot de passe',
                  button_label: 'Se connecter',
                  social_provider_text: 'Se connecter avec {{provider}}',
                  link_text: 'Vous avez déjà un compte ? Connectez-vous',
                },
                sign_up: {
                  email_label: 'Adresse e-mail',
                  password_label: 'Mot de passe',
                  button_label: 'Créer un compte',
                  social_provider_text: 'S\'inscrire avec {{provider}}',
                  link_text: 'Vous n\'avez pas de compte ? Inscrivez-vous',
                },
                forgotten_password: {
                  email_label: 'Adresse e-mail',
                  button_label: 'Envoyer les instructions',
                  link_text: 'Mot de passe oublié ?',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;