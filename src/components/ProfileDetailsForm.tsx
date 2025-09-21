import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { User } from '@supabase/supabase-js';

interface ProfileDetailsFormProps {
  user: User | null;
  initialFirstName: string;
  initialLastName: string;
  initialPhoneNumber: string;
  onProfileUpdate: (firstName: string, lastName: string, phoneNumber: string) => void;
}

const ProfileDetailsForm: React.FC<ProfileDetailsFormProps> = ({
  user,
  initialFirstName,
  initialLastName,
  initialPhoneNumber,
  onProfileUpdate,
}) => {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);

  useEffect(() => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setPhoneNumber(initialPhoneNumber);
  }, [initialFirstName, initialLastName, initialPhoneNumber]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (phoneNumber && !/^\d{8}$/.test(phoneNumber)) {
      showError(t("account_page.phone_number_format_error"));
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ 
        first_name: firstName, 
        last_name: lastName, 
        phone_number: phoneNumber,
        updated_at: new Date().toISOString() 
      })
      .eq('id', user.id);

    if (error) {
      showError(t("account_page.profile_update_error"));
    } else {
      showSuccess(t("account_page.profile_updated_success"));
      onProfileUpdate(firstName, lastName, phoneNumber);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("account_page.my_profile")}</CardTitle>
        <CardDescription>{t("account_page.manage_profile_info")}</CardDescription>
      </CardHeader>
      <form onSubmit={handleUpdateProfile}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">{t("account_page.email")}</Label>
            <Input id="email" type="email" value={user?.email || ''} disabled />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("account_page.first_name")}</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t("account_page.enter_first_name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("account_page.last_name")}</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t("account_page.enter_last_name")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">{t("account_page.phone_number")}</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={t("account_page.enter_phone_number")}
              maxLength={8}
            />
            {phoneNumber && !/^\d{8}$/.test(phoneNumber) && (
              <p className="text-sm text-red-500">{t("account_page.phone_number_format_error")}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">{t("account_page.save_changes")}</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfileDetailsForm;