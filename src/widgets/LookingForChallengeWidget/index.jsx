import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Card, Icon } from '@openedx/paragon';
import { ArrowForward, ArrowBack } from '@openedx/paragon/icons';

import { reduxHooks } from 'hooks';
import moreCoursesSVG from 'assets/more-courses-sidewidget.svg';
import { baseAppUrl } from 'data/services/lms/urls';
import logoEdelvives from 'assets/NationalLogo.png';
import logoElt from 'assets/E+.jpg';
import { findCoursesWidgetClicked } from './track';
import messages from './messages';
import './index.scss';

export const arrowIcon = (<Icon className="mx-1" src={ArrowForward} />);

export const LookingForChallengeWidget = () => {
  const { formatMessage } = useIntl();
  const { courseSearchUrl } = reduxHooks.usePlatformSettingsData();
  const hyperlinkDestination = baseAppUrl(courseSearchUrl) || '';

  return (
    <div id="custom-course-info-widget" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Tarjeta con imagen y mensaje */}
      <Card orientation="horizontal" id="looking-for-challenge-widget">
        <Card.ImageCap
          src={moreCoursesSVG}
          srcAlt="course side widget"
        />
        <Card.Body className="m-auto pr-2">
          <h4 style={{ color: '#0D47A1', fontWeight: 'bold' }}>
            🎓 ¡Tu curso ya está disponible!
          </h4>
        </Card.Body>
      </Card>
      <Card
  style={{
    // ¡NUEVO! Fondo gris claro para diferenciar el bloque sutilmente
    backgroundColor: '#f8f9fa', 
    borderRadius: '8px',
    border: '1px solid #dee2e6', // Borde estándar para un look limpio
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.07)', // Sombra un poco más notoria
    padding: '1.5rem',
  }}
>
  <Card.Body style={{ padding: '0' }}>
    <h3
      style={{
        fontSize: '1.2rem',
        fontWeight: '500', // Un grosor de letra moderno, no tan pesado como el bold
        color: '#2c3e50', // Un tono de negro azulado, más suave que el negro puro
        marginBottom: '1.5rem',
        textAlign: 'center', // Centramos el título para un look más amigable
        fontFamily: 'inherit',
        letterSpacing: '0.5px', // Un poco de espacio extra entre letras
      }}
    >
      {/* ¡NUEVO! Título con emojis y un toque más amigable */}
      ✨ Acceso a plataformas ✨
    </h3>

    {/* Contenedor para los logos */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e9ecef', // Línea divisoria para separar del título
      }}
    >
      {/* --- ENLACE Y LOGO 1 (Edelvives) --- */}
      <a
        href="https://learn.eltngl.com/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          padding: '0.5rem',
          borderRadius: '6px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <img
          src={logoEdelvives}
          alt="Logo de Edelvives Digital Plus"
          style={{
            maxHeight: '55px',
            width: 'auto',
            display: 'block',
          }}
        />
      </a>

      {/* --- ENLACE Y LOGO 2 (ELT) --- */}
      <a
        href="https://edelvivesdigitalplus.com.mx/auth/login"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          padding: '0.5rem',
          borderRadius: '6px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <img
          src={logoElt}
          alt="Logo de ELT NG Learn"
          style={{
            maxHeight: '55px',
            width: 'auto',
            display: 'block',
          }}
        />
      </a>
    </div>
  </Card.Body>
</Card>
      {/* Tarjeta con instrucciones y contacto */}
      <Card style={{ backgroundColor: '#fff3e0', padding: '1rem' }}>
        <Card.Body>
          <p style={{ lineHeight: '1.6', fontSize: '1rem' }}>
            ✅ Puedes acceder desde el <strong>menú de la izquierda</strong>.<br />
            🧠 Explora a tu ritmo, repasa cuando quieras y comienza a transformar lo que aprendiste en <strong>resultados reales</strong>.
          </p>
          <p style={{ marginTop: '1rem', lineHeight: '1.6', fontSize: '1rem' }}>
            📩 Si necesitas ayuda o tienes alguna duda, <strong>escríbenos</strong> con toda confianza a{' '}
            <a
              href="mailto:soporte@academusdigital.com"
              style={{ color: '#D32F2F', fontWeight: 'bold', textDecoration: 'underline' }}
            >
              soporte@academusdigital.com
            </a>.<br />
            💬 ¡Estamos para ayudarte!
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

LookingForChallengeWidget.propTypes = {};

export default LookingForChallengeWidget;
