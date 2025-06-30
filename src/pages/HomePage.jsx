import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import JobCard from '@/components/JobCard';
import { Loader2, Search, Filter, MapPin, Briefcase, DollarSign, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const HomePage = () => {
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
    { value: 'full-time', label: 'Tiempo Completo' },
    { value: 'part-time', label: 'Medio Tiempo' },
    { value: 'contract', label: 'Por Contrato' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Práctica' }
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Principiante' },
    { value: 'mid', label: 'Intermedio' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Líder' }
  ];

  const categories = [
    'Tecnología',
    'Ventas',
    'Marketing',
    'Administración',
    'Servicio al Cliente',
    'Finanzas',
    'Recursos Humanos',
    'Diseño',
    'Construcción',
    'Educación',
    'Salud',
    'Turismo',
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
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.profiles?.company_name && job.profiles.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro por tipo de trabajo
    if (selectedJobType) {
      filtered = filtered.filter(job => job.job_type === selectedJobType);
    }

    // Filtro por categoría
    if (selectedCategory) {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    // Filtro por ubicación
    if (selectedLocation) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Filtro por nivel de experiencia
    if (selectedExperience) {
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
    selectedJobType,
    selectedCategory,
    selectedLocation,
    selectedExperience,
    isRemote,
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
                    <SelectItem value="">Todos los tipos</SelectItem>
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
                    <SelectItem value="">Todas las categorías</SelectItem>
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
                    <SelectItem value="">Todos los niveles</SelectItem>
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
                    <SelectItem value="">Todas las modalidades</SelectItem>
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
    </>
  );
};

export default HomePage;