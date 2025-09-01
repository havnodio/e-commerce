import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
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
    <div className="container mx-auto flex justify-center items-center py-12">
      <div className="w-full max-w-md">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
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
                button_label: 'S\'inscrire',
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
  );
};

export default LoginPage;