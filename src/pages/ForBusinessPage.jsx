import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Building, 
  Search, 
  Shield,
  Zap,
  Heart,
  BarChart3,
  Globe,
  MapPin
} from 'lucide-react';

const ForBusinessPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handlePublishJob = () => {
    if (user) {
      navigate('/publicar-trabajo');
    } else {
      navigate('/login');
    }
  };
  const features = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Alcance Local Preciso",
      description: "Conecta directamente con candidatos de San Mateo y áreas cercanas que están buscando trabajo."
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "Publicación Rápida",
      description: "Publica tus ofertas de trabajo en minutos y comienza a recibir aplicaciones inmediatamente."
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Candidatos de Calidad",
      description: "Accede a una base de datos de profesionales locales verificados y comprometidos."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Análisis Detallados",
      description: "Obtén estadísticas sobre el rendimiento de tus publicaciones y optimiza tu estrategia."
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Proceso Seguro",
      description: "Plataforma confiable con verificación de identidad y protección de datos."
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-600" />,
      title: "Impacto Social",
      description: "Contribuye al desarrollo económico local y fortalece la comunidad de San Mateo."
    }
  ];

  const testimonials = [
    {
      name: "María González",
      company: "Restaurante El Jardín",
      text: "Encontramos al personal perfecto para nuestro restaurante. La plataforma es muy fácil de usar y los candidatos son de excelente calidad.",
      rating: 5
    },
    {
      name: "Carlos Ramírez",
      company: "Constructora San Mateo",
      text: "Hemos contratado a varios trabajadores a través de Tu Brete. Nos ha ahorrado mucho tiempo en el proceso de reclutamiento.",
      rating: 5
    },
    {
      name: "Ana Solís",
      company: "Clínica Dental Sonrisa",
      text: "La rapidez para encontrar candidatos calificados superó nuestras expectativas. Definitivamente recomendamos la plataforma.",
      rating: 5
    }
  ];

  const stats = [
    { label: "Empresas activas", value: "50+", icon: <Building className="h-6 w-6" /> },
    { label: "Tiempo promedio de contratación", value: "7 días", icon: <Clock className="h-6 w-6" /> },
    { label: "Tasa de éxito", value: "95%", icon: <TrendingUp className="h-6 w-6" /> },
    { label: "Candidatos registrados", value: "500+", icon: <Users className="h-6 w-6" /> }
  ];

  return (
    <>
      <Helmet>
        <title>Para Empresas - Tu Brete San Mateo</title>
        <meta name="description" content="Encuentra el talento que necesitas para tu empresa en San Mateo. Publica empleos y conecta con los mejores candidatos locales." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <motion.section 
          className="py-20 bg-gradient-to-br from-primary/10 via-green-50 to-blue-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  Para Empresas
                </Badge>
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
                  Encuentra el <span className="gradient-text">talento local</span> que necesitas
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Conecta con los mejores candidatos de San Mateo y áreas cercanas. 
                  Publica empleos, gestiona aplicaciones y haz crecer tu equipo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={handleGetStarted}>
                    {user ? 'Ir al Dashboard' : 'Comenzar gratis'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          className="py-16 bg-white"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">{stat.icon}</div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="py-20 bg-gray-50"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ¿Por qué elegir nuestra plataforma?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Ofrecemos las herramientas más efectivas para encontrar y contratar el talento que tu empresa necesita
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="mb-4">{feature.icon}</div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section 
          className="py-20 bg-gray-50"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Lo que dicen nuestros clientes
              </h2>
              <p className="text-lg text-gray-600">
                Empresas locales que han encontrado el éxito con nuestra plataforma
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.company}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-20 bg-gradient-to-r from-primary to-green-600 text-white"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para encontrar tu próximo gran empleado?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Únete a las empresas que ya están construyendo equipos exitosos en San Mateo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
                onClick={handlePublishJob}
              >
                {user ? 'Publicar empleo' : 'Publicar empleo gratis'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
                onClick={() => window.open('mailto:contacto@tubretesanmateo.com?subject=Contacto%20con%20experto', '_blank')}
              >
                Hablar con un experto
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </>
  );
};

export default ForBusinessPage;
