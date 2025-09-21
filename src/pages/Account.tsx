import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { useEffect, useState } from "react";
import { Zap, Copy, Check, Upload, X, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const AccountPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url, phone_number')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          showError(t("account_page.profile_fetch_error"));
        } else if (data) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setAvatarUrl(data.avatar_url || '');
          setPhoneNumber(data.phone_number || '');
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, t]);

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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error(t('account_page.select_image_error'));
      }

      const file = event.target.files[0];

      // Client-side validation for file type and size
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        showError(t('account_page.invalid_file_type'));
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        showError(t('account_page.file_size_exceeded'));
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      showSuccess(t("account_page.avatar_updated_success"));
      
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      showError(error.message || t("account_page.avatar_upload_error"));
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!user) return;
    try {
      if (!avatarUrl) return;

      const filePath = avatarUrl.substring(avatarUrl.indexOf('/avatars/') + 9);

      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (deleteError) {
        console.error('Delete error:', deleteError);
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: null,
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl('');
      showSuccess(t("account_page.avatar_removed_success"));
      
    } catch (error: any) {
      console.error('Error removing avatar:', error);
      showError(error.message || t("account_page.avatar_remove_error"));
    }
  };

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

  const getInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  if (loading) {
    return <div className="container mx-auto py-12 text-center">{t("account_page.loading_profile")}</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("account_page.my_profile")}</CardTitle>
            <CardDescription>{t("account_page.manage_profile_info")}</CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdateProfile}>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-lg">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm" asChild disabled={uploading}>
                        <span className="flex items-center gap-2">
                          {uploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          {uploading ? t('account_page.uploading') : t('account_page.upload_avatar')}
                        </span>
                      </Button>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </Label>
                    {avatarUrl && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={uploading}
                            className="flex items-center gap-2"
                          >
                            <X className="h-4 w-4" />
                            {t('account_page.remove_avatar')}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('account_page.confirm_avatar_removal_title')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('account_page.confirm_avatar_removal_description')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('account_page.cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={removeAvatar} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              {t('account_page.remove')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('account_page.avatar_file_types')}
                  </p>
                </div>
              </div>

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
      </div>
    </div>
  );
};

export default AccountPage;