-- =====================================================
-- SCRIPT PARA RECREAR COMPLETAMENTE LA BASE DE DATOS
-- Tu Brete San Mateo - Sistema de Empleos
-- =====================================================

-- IMPORTANTE: Este script eliminará TODAS las tablas existentes y recreará la base de datos desde cero
-- Ejecutar SOLO en desarrollo, NUNCA en producción con datos importantes

-- =====================================================
-- 1. ELIMINACIÓN DE TABLAS EXISTENTES
-- =====================================================

-- Eliminar tablas en orden correcto (dependencias primero)
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Eliminar políticas de RLS si existen
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON jobs;
DROP POLICY IF EXISTS "Users can insert their own jobs" ON jobs;
DROP POLICY IF EXISTS "Users can update their own jobs" ON jobs;
DROP POLICY IF EXISTS "Users can delete their own jobs" ON jobs;
DROP POLICY IF EXISTS "Applications are viewable by job owners and applicants" ON applications;
DROP POLICY IF EXISTS "Anyone can create an application" ON applications;
DROP POLICY IF EXISTS "Job owners can update application status" ON applications;

-- =====================================================
-- 2. CREACIÓN DE EXTENSIONES NECESARIAS
-- =====================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 3. TABLA DE PERFILES DE USUARIO
-- =====================================================

CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    company_name TEXT,
    website TEXT,
    phone TEXT,
    description TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX idx_profiles_company_name ON profiles(company_name);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- =====================================================
-- 4. TABLA DE EMPLEOS/OFERTAS DE TRABAJO
-- =====================================================

CREATE TABLE jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    company_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    benefits TEXT,
    location TEXT NOT NULL DEFAULT 'San Mateo',
    job_type TEXT NOT NULL CHECK (job_type IN ('full-time', 'part-time', 'contract', 'freelance', 'internship')),
    category TEXT,
    experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'lead')),
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency TEXT DEFAULT 'CRC' CHECK (salary_currency IN ('CRC', 'USD')),
    is_remote BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización y búsqueda
CREATE INDEX idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_jobs_expires_at ON jobs(expires_at);
CREATE INDEX idx_jobs_salary_min ON jobs(salary_min);
CREATE INDEX idx_jobs_salary_max ON jobs(salary_max);

-- Índice compuesto para consultas comunes
CREATE INDEX idx_jobs_active_location ON jobs(status, location) WHERE status = 'active';

-- =====================================================
-- 5. TABLA DE APLICACIONES A EMPLEOS
-- =====================================================

CREATE TABLE applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    applicant_name TEXT NOT NULL,
    applicant_phone TEXT NOT NULL,
    applicant_email TEXT,
    applicant_message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'rejected', 'hired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX idx_applications_applicant_email ON applications(applicant_email);

-- Índice único para evitar aplicaciones duplicadas (opcional)
-- CREATE UNIQUE INDEX idx_unique_application ON applications(job_id, applicant_email) WHERE applicant_email IS NOT NULL;

-- =====================================================
-- 6. TRIGGERS PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
-- =====================================================

-- Función para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at 
    BEFORE UPDATE ON jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Políticas para PROFILES
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para JOBS
CREATE POLICY "Jobs are viewable by everyone" ON jobs
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own jobs" ON jobs
    FOR INSERT WITH CHECK (auth.uid() = employer_id);

CREATE POLICY "Users can update their own jobs" ON jobs
    FOR UPDATE USING (auth.uid() = employer_id);

CREATE POLICY "Users can delete their own jobs" ON jobs
    FOR DELETE USING (auth.uid() = employer_id);

-- Políticas para APPLICATIONS
CREATE POLICY "Applications are viewable by job owners" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM jobs 
            WHERE jobs.id = applications.job_id 
            AND jobs.employer_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can create an application" ON applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Job owners can update application status" ON applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM jobs 
            WHERE jobs.id = applications.job_id 
            AND jobs.employer_id = auth.uid()
        )
    );

-- =====================================================
-- 8. FUNCIONES AUXILIARES
-- =====================================================

-- Función para limpiar empleos expirados
CREATE OR REPLACE FUNCTION cleanup_expired_jobs()
RETURNS INTEGER AS $$
DECLARE
    affected_rows INTEGER;
BEGIN
    UPDATE jobs 
    SET status = 'closed' 
    WHERE expires_at < NOW() 
    AND status = 'active';
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    RETURN affected_rows;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de empleador
CREATE OR REPLACE FUNCTION get_employer_stats(employer_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_jobs', (SELECT COUNT(*) FROM jobs WHERE employer_id = employer_uuid),
        'active_jobs', (SELECT COUNT(*) FROM jobs WHERE employer_id = employer_uuid AND status = 'active'),
        'total_applications', (
            SELECT COUNT(*) 
            FROM applications a 
            JOIN jobs j ON a.job_id = j.id 
            WHERE j.employer_id = employer_uuid
        ),
        'recent_applications', (
            SELECT COUNT(*) 
            FROM applications a 
            JOIN jobs j ON a.job_id = j.id 
            WHERE j.employer_id = employer_uuid 
            AND a.created_at >= NOW() - INTERVAL '7 days'
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. DATOS DE EJEMPLO (OPCIONAL - SOLO PARA DESARROLLO)
-- =====================================================

-- Descomentar las siguientes líneas si quieres datos de ejemplo

/*
-- Insertar algunas categorías comunes como datos de ejemplo
INSERT INTO jobs (
    employer_id, 
    company_name, 
    title, 
    description, 
    location, 
    job_type, 
    category, 
    experience_level,
    salary_min,
    salary_max,
    salary_currency,
    status
) VALUES 
-- Estos empleos requieren usuarios existentes, por lo que se comentan
-- Puedes descomentarlos después de crear usuarios de prueba
*/

-- =====================================================
-- 10. VISTAS ÚTILES
-- =====================================================

-- Vista para empleos con información del empleador
CREATE VIEW jobs_with_employer AS
SELECT 
    j.*,
    p.company_name as employer_company_name,
    p.website as employer_website,
    p.logo_url as employer_logo,
    (
        SELECT COUNT(*) 
        FROM applications a 
        WHERE a.job_id = j.id
    ) as application_count
FROM jobs j
LEFT JOIN profiles p ON j.employer_id = p.id;

-- Vista para aplicaciones con información del empleo
CREATE VIEW applications_with_job_info AS
SELECT 
    a.*,
    j.title as job_title,
    j.company_name,
    j.location as job_location,
    j.job_type,
    j.salary_min,
    j.salary_max,
    j.salary_currency
FROM applications a
JOIN jobs j ON a.job_id = j.id;

-- =====================================================
-- INFORMACIÓN IMPORTANTE
-- =====================================================

-- ✅ Estructura de tablas creada correctamente
-- ✅ Índices optimizados para consultas comunes
-- ✅ Políticas de seguridad RLS configuradas
-- ✅ Triggers para updated_at automático
-- ✅ Funciones auxiliares incluidas
-- ✅ Vistas útiles para consultas complejas

-- PRÓXIMOS PASOS:
-- 1. Ejecutar este script en tu base de datos Supabase
-- 2. Verificar que todas las tablas se crearon correctamente
-- 3. Probar la creación de empleos desde la aplicación
-- 4. Verificar que las aplicaciones funcionan correctamente

COMMIT;
