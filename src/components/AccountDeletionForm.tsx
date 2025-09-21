import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface AccountDeletionFormProps {
  user: User | null;
}

const AccountDeletionForm: React.FC<AccountDeletionFormProps> = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user || !user.email) {
      showError(t("account_page.user_not_found"));
      return;
    }

    if (!confirmPassword) {
      showError(t("account_page.enter_password_to_confirm"));
      return;
    }

    setIsDeleting(true);
    try {
      // Re-authenticate the user with their password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: confirmPassword,
      });

      if (signInError) {
        throw new Error(t("account_page.incorrect_password_for_deletion"));
      }

      // If re-authentication is successful, proceed with deletion
      const { error: deleteError } = await supabase.auth.deleteUser();

      if (deleteError) {
        throw deleteError;
      }

      showSuccess(t("account_page.account_deleted_success"));
      setDialogOpen(false);
      navigate('/login'); // Redirect to login page after deletion

    } catch (error: any) {
      console.error('Account deletion error:', error);
      showError(error.message || t("account_page.account_deletion_error"));
    } finally {
      setIsDeleting(false);
      setConfirmPassword('');
    }
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive">{t("account_page.delete_account")}</CardTitle>
        <CardDescription>{t("account_page.delete_account_description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isDeleting}>
              {t("account_page.delete_account_button")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("account_page.confirm_account_deletion_title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("account_page.confirm_account_deletion_description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <Label htmlFor="confirm-password">{t("account_page.enter_your_password")}</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("account_page.password_placeholder")}
                disabled={isDeleting}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>{t("account_page.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting || !confirmPassword}
              >
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {t("account_page.confirm_delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default AccountDeletionForm;