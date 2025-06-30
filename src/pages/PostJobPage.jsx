import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import PostJobForm from '@/components/PostJobForm';

const PostJobPage = () => {
  return (
    <>
      <Helmet>
        <title>Publicar un Brete - Tu Brete San Mateo</title>
        <meta name="description" content="Publica una nueva oportunidad de trabajo para la comunidad de San Mateo." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-2">
            Publica un <span className="gradient-text">Brete</span>
          </h1>
          <p className="text-lg text-gray-600">Completa los detalles de la oportunidad de trabajo.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md border">
          <PostJobForm />
        </div>
      </motion.div>
    </>
  );
};

export default PostJobPage;