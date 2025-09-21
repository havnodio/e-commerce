import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { User } from '@supabase/supabase-js';

interface PasswordChangeFormProps {
  user: User | null;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ user }) => {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let password = "";
    
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26));
    password += "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 26));
    password += "0123456789".charAt(Math.floor(Math.random() * 10));
    password += "!@#$%^&*()_+-=[]{}|;:,.<>?".charAt(Math.floor(Math.random() * 26));
    
    for (let i = password.length; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setNewPassword(password);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(newPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showError(t("account_page.copy_failed"));
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) {
        showError(t("account_page.user_not_found"));
        return;
    }
    if (!currentPassword || !newPassword) {
        showError(t("account_page.fill_all_password_fields"));
        return;
    }
    if (newPassword.length < 6) {
        showError(t("account_page.new_password_min_length"));
        return;
    }

    setUpdatingPassword(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      showError(t("account_page.current_password_incorrect"));
      setUpdatingPassword(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      showError(t("account_page.password_update_error"));
    } else {
      showSuccess(t("account_page.password_update_success"));
      setCurrentPassword('');
      setNewPassword('');
    }
    setUpdatingPassword(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("account_page.change_password")}</CardTitle>
        <CardDescription>{t("account_page.update_password_here")}</CardDescription>
      </CardHeader>
      <form onSubmit={handleUpdatePassword}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t("account_page.current_password")}</Label>
            <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="newPassword">{t("account_page.new_password")}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generatePassword}
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                {t("account_page.generate")}
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                id="newPassword"
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="flex-1"
              />
              {newPassword && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>
            {newPassword && (
              <p className="text-xs text-muted-foreground">
                {t("account_page.password_strength")} {newPassword.length >= 12 ? t('account_page.strong') : newPassword.length >= 8 ? t('account_page.medium') : t('account_page.weak')}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={updatingPassword}>
            {updatingPassword ? t('account_page.updating') : t('account_page.update_password')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PasswordChangeForm;