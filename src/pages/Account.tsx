import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import AvatarManagement from "@/components/AvatarManagement";
import ProfileDetailsForm from "@/components/ProfileDetailsForm";
import PasswordChangeForm from "@/components/PasswordChangeForm";
import AccountDeletionForm from "@/components/AccountDeletionForm"; // Import the new component

const AccountPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        console.log('AccountPage: Fetching profile for user:', user.id); // Added log
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url, phone_number')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('AccountPage: Error fetching profile:', error); // Added log
          showError(t("account_page.profile_fetch_error"));
        } else if (data) {
          console.log('AccountPage: Profile data fetched:', data); // Added log
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setAvatarUrl(data.avatar_url || '');
          setPhoneNumber(data.phone_number || '');
        }
        setLoading(false);
        console.log('AccountPage: Loading set to false'); // Added log
      }
    };

    fetchProfile();
  }, [user, t]);

  const handleAvatarChange = (newUrl: string | null) => {
    setAvatarUrl(newUrl || '');
  };

  const handleProfileUpdate = (newFirstName: string, newLastName: string, newPhoneNumber: string) => {
    setFirstName(newFirstName);
    setLastName(newLastName);
    setPhoneNumber(newPhoneNumber);
  };

  if (loading) {
    return <div className="container mx-auto py-12 text-center">{t("account_page.loading_profile")}</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Avatar Management */}
        <AvatarManagement
          user={user}
          initialAvatarUrl={avatarUrl}
          initialFirstName={firstName}
          initialLastName={lastName}
          onAvatarChange={handleAvatarChange}
        />

        {/* Profile Details Form */}
        <ProfileDetailsForm
          user={user}
          initialFirstName={firstName}
          initialLastName={lastName}
          initialPhoneNumber={phoneNumber}
          onProfileUpdate={handleProfileUpdate}
        />

        {/* Password Change Form */}
        <PasswordChangeForm user={user} />

        {/* Account Deletion Form */}
        <AccountDeletionForm user={user} />
      </div>
    </div>
  );
};

export default AccountPage;