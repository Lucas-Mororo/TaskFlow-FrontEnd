import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Bell, 
  Globe, 
  Trash2,
  Shield,
  Palette
} from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { toast } from 'sonner';

export const Settings = () => {
  const { user, updateUserProfile } = useTaskStore();
  const [darkMode, setDarkMode] = useState(
    user?.preferences?.darkMode || document.documentElement.classList.contains('dark')
  );
  const [notifications, setNotifications] = useState(
    user?.preferences?.notifications ?? true
  );
  const [language, setLanguage] = useState(
    user?.preferences?.language || 'pt'
  );

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    updateUserProfile({
      preferences: {
        ...user?.preferences,
        darkMode: enabled,
      }
    });

    toast.success(enabled ? 'Modo escuro ativado' : 'Modo claro ativado');
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    setNotifications(enabled);
    
    updateUserProfile({
      preferences: {
        ...user?.preferences,
        notifications: enabled,
      }
    });

    toast.success(enabled ? 'Notificações ativadas' : 'Notificações desativadas');
  };

  const handleLanguageChange = (newLanguage: 'pt' | 'en') => {
    setLanguage(newLanguage);
    
    updateUserProfile({
      preferences: {
        ...user?.preferences,
        language: newLanguage,
      }
    });

    toast.success(newLanguage === 'pt' ? 'Idioma alterado para Português' : 'Language changed to English');
  };

  const handleDeleteAccount = () => {
    // Clear all localStorage data
    localStorage.clear();
    
    // Reload the page to reset the app state
    window.location.reload();
    
    toast.success('Conta deletada com sucesso');
  };

  const handleExportData = () => {
    const { tasks, user, notifications } = useTaskStore.getState();
    
    const data = {
      user,
      tasks,
      notifications,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Dados exportados com sucesso');
  };

  return (
    <AppLayout title="Configurações" subtitle="Personalize sua experiência">
      <div className="space-y-6 max-w-2xl mx-auto">
        
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Modo Escuro</Label>
                <p className="text-sm text-muted-foreground">
                  Alterne entre tema claro e escuro
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <Switch
                  checked={darkMode}
                  onCheckedChange={handleDarkModeToggle}
                />
                <Moon className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Idioma e Região
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Idioma</Label>
                <p className="text-sm text-muted-foreground">
                  Escolha o idioma da interface
                </p>
              </div>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notificações Toast</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações sobre ações e lembretes
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={handleNotificationsToggle}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Tipos de Notificação</h4>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Tarefas Vencendo</Label>
                  <p className="text-xs text-muted-foreground">
                    Lembrete quando tarefas estão próximas do vencimento
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Tarefas Compartilhadas</Label>
                  <p className="text-xs text-muted-foreground">
                    Notificação quando receber tarefas compartilhadas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Atualizações de Tarefas</Label>
                  <p className="text-xs text-muted-foreground">
                    Notificação quando tarefas compartilhadas forem atualizadas
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Dados e Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Exportar Dados</Label>
                <p className="text-sm text-muted-foreground">
                  Baixe uma cópia de todos os seus dados
                </p>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                Exportar
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Limpar Cache</Label>
                <p className="text-sm text-muted-foreground">
                  Remove dados temporários e cache do navegador
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  // Clear only cache-related data, not user data
                  sessionStorage.clear();
                  toast.success('Cache limpo com sucesso');
                }}
              >
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Zona de Perigo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Deletar Conta</Label>
                <p className="text-sm text-muted-foreground">
                  Remove permanentemente sua conta e todos os dados
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    Deletar Conta
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso irá deletar permanentemente sua
                      conta e remover todos os seus dados dos nossos servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                      Sim, deletar conta
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};