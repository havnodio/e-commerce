import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { User } from '@supabase/supabase-js';

interface AvatarManagementProps {
  user: User | null;
  initialAvatarUrl: string;
  initialFirstName: string;
  initialLastName: string;
  onAvatarChange: (newUrl: string | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const AvatarManagement: React.FC<AvatarManagementProps> = ({
  user,
  initialAvatarUrl,
  initialFirstName,
  initialLastName,
  onAvatarChange,
}) => {
  const { t } = useTranslation();
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    setAvatarUrl(initialAvatarUrl);
  }, [initialAvatarUrl]);

  const getInitials = () => {
    return `${initialFirstName.charAt(0)}${initialLastName.charAt(0)}`.toUpperCase() || 'U';
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error(t('account_page.select_image_error'));
      }

      const file = event.target.files[0];

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
      onAvatarChange(publicUrl);
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
      onAvatarChange(null);
      showSuccess(t("account_page.avatar_removed_success"));
      
    } catch (error: any) {
      console.error('Error removing avatar:', error);
      showError(error.message || t("account_page.avatar_remove_error"));
    }
  };

  return (
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
  );
};

export default AvatarManagement;