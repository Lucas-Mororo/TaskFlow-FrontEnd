import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckSquare, ArrowRight, Users, BarChart3, Shield, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const Index = () => {
  const features = [
    {
      icon: CheckSquare,
      title: 'Gestão Inteligente',
      description: 'Organize suas tarefas com prioridades, tags e prazos de forma intuitiva'
    },
    {
      icon: Users,
      title: 'Colaboração',
      description: 'Compartilhe tarefas e trabalhe em equipe de forma eficiente'
    },
    {
      icon: BarChart3,
      title: 'Relatórios',
      description: 'Acompanhe seu progresso com relatórios detalhados e métricas'
    },
    {
      icon: Shield,
      title: 'Segurança',
      description: 'Seus dados protegidos com criptografia de ponta a ponta'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <CheckSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>
            <Button asChild className="gradient-primary shadow-medium hover:shadow-strong transition-all">
              <Link to="/auth">
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Gerencie Tarefas
                </span>
                <br />
                <span className="text-foreground">Com Inteligência</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                TaskFlow é a plataforma completa para gerenciamento de tarefas que combina 
                simplicidade, poder e colaboração em uma interface elegante e intuitiva.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="gradient-primary shadow-strong hover:shadow-glow transition-all text-lg px-8 py-6">
                  <Link to="/auth">
                    <Zap className="mr-2 h-5 w-5" />
                    Começar Gratuitamente
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 hover:bg-accent">
                  Ver Demonstração
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 gradient-primary rounded-3xl blur-2xl opacity-20 animate-pulse-glow"></div>
              <img 
                src={heroImage} 
                alt="TaskFlow Dashboard Preview" 
                className="relative w-full h-auto rounded-3xl shadow-strong border border-border/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Recursos Poderosos
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para ser mais produtivo e organizado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="glass-card border-0 shadow-medium hover:shadow-strong transition-all duration-300 p-6 text-center"
              >
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Pronto para Revolucionar sua Produtividade?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Junte-se a milhares de profissionais que já transformaram sua forma de trabalhar
          </p>
          <Button asChild size="lg" className="gradient-primary shadow-strong hover:shadow-glow transition-all text-lg px-12 py-6">
            <Link to="/auth">
              Criar Conta Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 TaskFlow. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
