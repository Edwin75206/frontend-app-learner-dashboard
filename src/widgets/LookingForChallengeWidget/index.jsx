import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Card, Icon } from '@openedx/paragon';
import { ArrowForward, ArrowBack } from '@openedx/paragon/icons';

import { reduxHooks } from 'hooks';
import moreCoursesSVG from 'assets/more-courses-sidewidget.svg';
import { baseAppUrl } from 'data/services/lms/urls';

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
