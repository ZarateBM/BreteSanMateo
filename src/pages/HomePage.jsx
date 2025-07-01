import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import JobCard from '@/components/JobCard';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Search, Filter, MapPin, Briefcase, DollarSign, X, Users, TrendingUp, Shield, Heart, ArrowRight, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  // Si el usuario es una empresa logueada, redirigir al dashboard
  useEffect(() => {
    if (user && profile) {
      navigate('/dashboard');
    }
  }, [user, profile, navigate]);

  // Si hay un usuario logueado (empresa), no mostrar nada mientras se redirige
  if (user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-2">Redirigiendo al dashboard...</span>
      </div>
    );
  }

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [isRemote, setIsRemote] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');

  // Opciones para los filtros
  const jobTypes = [
    { value: 'Tiempo Completo', label: 'Tiempo Completo' },
    { value: 'Medio Tiempo', label: 'Medio Tiempo' },
    { value: 'Por Horas', label: 'Por Horas' },
    { value: 'Temporal', label: 'Temporal' },
    { value: 'Freelance', label: 'Freelance' }
  ];

  const experienceLevels = [
    { value: 'Sin experiencia', label: 'Sin experiencia' },
    { value: '1-2 años', label: '1-2 años' },
    { value: '3-5 años', label: '3-5 años' },
    { value: '5+ años', label: '5+ años' },
    { value: 'Senior', label: 'Senior' }
  ];

  const categories = [
    'Construcción',
    'Servicios',
    'Comercio',
    'Turismo',
    'Tecnología',
    'Salud',
    'Educación',
    'Agricultura',
    'Transporte',
    'Manufactura',
    'Gastronomía',
    'Limpieza',
    'Seguridad',
    'Otros'
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching jobs:', error);
        } else {
          console.log('Jobs fetched:', data); // Debug log
          setJobs(data || []);
          setFilteredJobs(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Función para aplicar filtros
  useEffect(() => {
    let filtered = [...jobs];

    // Filtro por búsqueda de texto
    if (searchTerm.trim()) {
      filtered = filtered.filter(job =>
        (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.company_name && job.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro por tipo de trabajo
    if (selectedJobType && selectedJobType !== 'all') {
      filtered = filtered.filter(job => job.job_type === selectedJobType);
    }

    // Filtro por categoría
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    // Filtro por ubicación
    if (selectedLocation) {
      filtered = filtered.filter(job => 
        job.location && job.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Filtro por nivel de experiencia
    if (selectedExperience && selectedExperience !== 'all') {
      filtered = filtered.filter(job => job.experience_level === selectedExperience);
    }

    // Filtro por trabajo remoto
    if (isRemote === 'true') {
      filtered = filtered.filter(job => job.is_remote === true);
    } else if (isRemote === 'false') {
      filtered = filtered.filter(job => job.is_remote === false);
    }

    // Filtro por rango salarial
    if (salaryMin) {
      filtered = filtered.filter(job => 
        job.salary_min && job.salary_min >= parseInt(salaryMin)
      );
    }

    if (salaryMax) {
      filtered = filtered.filter(job => 
        job.salary_max && job.salary_max <= parseInt(salaryMax)
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedJobType, selectedCategory, selectedLocation, selectedExperience, isRemote, salaryMin, salaryMax]);

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedJobType('');
    setSelectedCategory('');
    setSelectedLocation('');
    setSelectedExperience('');
    setIsRemote('');
    setSalaryMin('');
    setSalaryMax('');
  };

  // Contar filtros activos
  const activeFiltersCount = [
    searchTerm,
    selectedJobType && selectedJobType !== 'all' ? selectedJobType : '',
    selectedCategory && selectedCategory !== 'all' ? selectedCategory : '',
    selectedLocation,
    selectedExperience && selectedExperience !== 'all' ? selectedExperience : '',
    isRemote && isRemote !== 'all' ? isRemote : '',
    salaryMin,
    salaryMax
  ].filter(filter => filter).length;

  return (
    <>
      <Helmet>
        <title>Inicio - Tu Brete San Mateo</title>
        <meta name="description" content="Encuentra oportunidades de trabajo en San Mateo. ¡Aplica hoy!" />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
            Encuentra tu Próximo <span className="gradient-text">Brete</span>
          </h1>
          <p className="text-lg text-gray-600">Oportunidades de trabajo locales en San Mateo.</p>
        </div>

        {/* Barra de búsqueda principal */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="search-input-container relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar trabajos por título, empresa o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-primary rounded-lg"
            />
          </div>
        </div>

        {/* Botón de filtros y resultados */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="default" className="filter-badge ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="clear-filters-button flex items-center gap-2 text-gray-600"
              >
                <X className="h-4 w-4" />
                Limpiar filtros
              </Button>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {loading ? (
              'Cargando...'
            ) : (
              `${filteredJobs.length} trabajo${filteredJobs.length !== 1 ? 's' : ''} encontrado${filteredJobs.length !== 1 ? 's' : ''}`
            )}
          </div>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="filter-panel bg-gray-50 p-6 rounded-lg mb-8 border filter-transition"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtrar resultados
            </h3>
            
            <div className="filter-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Tipo de trabajo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="inline h-4 w-4 mr-1" />
                  Tipo de trabajo
                </label>
                <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                  <SelectTrigger className="filter-select">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {jobTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Ubicación
                </label>
                <Input
                  type="text"
                  placeholder="Ej: San Mateo, Alajuela"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                />
              </div>

              {/* Nivel de experiencia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de experiencia
                </label>
                <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los niveles</SelectItem>
                    {experienceLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Trabajo remoto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modalidad
                </label>
                <Select value={isRemote} onValueChange={setIsRemote}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar modalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las modalidades</SelectItem>
                    <SelectItem value="true">Remoto</SelectItem>
                    <SelectItem value="false">Presencial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rango salarial */}
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Rango salarial (₡)
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Mín"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Máx"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 px-6 bg-gray-100 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800">No hay bretes por ahora</h3>
            <p className="text-gray-600 mt-2">¡Vuelve pronto! Siempre hay nuevas oportunidades apareciendo.</p>
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-gray-100 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800">No se encontraron trabajos</h3>
            <p className="text-gray-600 mt-2">Intenta ajustar tus filtros de búsqueda para encontrar más oportunidades.</p>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4"
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </motion.div>

      {/* Secciones informativas */}
      {!loading && (
        <>
          {/* Sección de estadísticas */}
          <motion.section 
            className="py-16 bg-gradient-to-r from-primary/10 to-green-50 rounded-2xl my-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Conectando Talento en <span className="gradient-text">San Mateo</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Somos la plataforma líder para encontrar oportunidades laborales locales
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">500+</h3>
                <p className="text-gray-600">Personas conectadas</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">100+</h3>
                <p className="text-gray-600">Empleos publicados</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">95%</h3>
                <p className="text-gray-600">Tasa de éxito</p>
              </motion.div>
            </div>
          </motion.section>

          {/* Sección de beneficios para candidatos */}
          <motion.section 
            className="py-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ¿Por qué elegir Tu Brete San Mateo?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Te ofrecemos las mejores herramientas para encontrar tu trabajo ideal
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="bg-primary/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                      <Search className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Búsqueda Inteligente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Encuentra trabajos que se adapten a tu perfil con nuestros filtros avanzados y búsqueda por ubicación.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="bg-green-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle>Empresas Verificadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Trabajamos solo con empresas locales confiables para garantizar oportunidades legítimas.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                      <Heart className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle>Apoyo Local</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Promovemos el crecimiento económico de San Mateo conectando talento local con oportunidades.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.section>

          {/* Sección de categorías populares */}
          <motion.section 
            className="py-16 bg-gray-50 rounded-2xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Categorías Populares
              </h2>
              <p className="text-lg text-gray-600">
                Explora las áreas con más oportunidades de empleo
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.slice(0, 6).map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowFilters(true);
                  }}
                >
                  <div className="text-2xl mb-2">
                    {category === 'Construcción' && '🏗️'}
                    {category === 'Servicios' && '⚙️'}
                    {category === 'Comercio' && '🛍️'}
                    {category === 'Turismo' && '🏖️'}
                    {category === 'Tecnología' && '💻'}
                    {category === 'Salud' && '🏥'}
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900">{category}</h3>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Call to action para empresas */}
          <motion.section 
            className="py-16 bg-gradient-to-r from-primary to-green-600 rounded-2xl text-white my-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿Tienes una empresa?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Encuentra el talento que necesitas para hacer crecer tu negocio en San Mateo
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={() => window.location.href = '/for-business'}
                >
                  Conoce más
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              
              </div>
            </div>
          </motion.section>
        </>
      )}
    </>
  );
};

export default HomePage;