import type { MessageKey } from './index'

export const es = {
	'common.not_answered': 'Sin responder',
	'common.choose_an_option': 'Elige una opción',
	'common.choose_month': 'Elige un mes',
	'common.choose_one_answer': 'Elige una respuesta',
	'common.choose_all_that_apply': 'Elige todas las que correspondan',

	'steps.common.multi_choice_hint': 'Elige todas las que correspondan.',
	'steps.common.multi_choice_none_error': 'Elige una opción o selecciona «Ninguna de estas».',
	'steps.common.multi_choice_not_sure_error':
		'Elige una opción o selecciona «Ninguna de estas» o «No estoy seguro/a».',

	'common.continue': 'Continuar',
	'common.back': 'Volver',
	'common.problem': 'Hay un problema',
	'common.change': 'Cambiar',
	'common.see_result': 'Ver resultado',
	'common.review_answers': 'Revisar tus respuestas',
	'common.start_again': 'Empezar de nuevo',
	'common.download_handover_pdf': 'Descargar PDF del resumen',
	'common.see_support_options': 'Ver opciones de apoyo',
	'common.open_official_portal': 'Abrir el portal oficial de regularización',
	'common.back_to_answers': 'Volver a las respuestas',
	'common.visit_website': 'Visitar sitio web',
	'common.email': 'Enviar correo',
	'common.call': 'Llamar',
	'common.open_directory': 'Abrir directorio',
	'chrome.skip_to_main': 'Saltar al contenido principal',
	'chrome.app_title': 'Primer Paso',
	'chrome.meta_description':
		'Primer Paso es un cuestionario inicial para el proceso extraordinario de regularización de España de 2026. Está alojado en primerpaso.org.',
	'chrome.brand': 'Primer Paso',
	'chrome.tagline': 'Orientación independiente para el proceso de regularización de España de 2026',
	'chrome.primary_navigation': 'Navegación principal',
	'chrome.nav.home': 'Inicio',
	'chrome.nav.start': 'Ver mi primer paso',
	'chrome.nav.organisations': 'Buscar organizaciones',
	'chrome.footer.title': 'Sobre esta herramienta',
	'chrome.footer.body':
		'Primer Paso ayuda a orientarse en el proceso de regularización extraordinaria de 2026 en España, identificar qué documentos o información pueden faltar y decidir cuándo usar el portal oficial o buscar apoyo.',
	'chrome.footer.attribution_prefix': 'Desarrollado por',
	'chrome.footer.attribution_name': 'Radical Data',
	'chrome.footer.disclaimer': 'No sustituye asesoría legal ni constituye una decisión oficial.',
	'chrome.footer.link.official_portal': 'Portal oficial',
	'chrome.language_switcher_label': 'Idioma',
	'pages.home.title': 'Tu camino hacia la regularización',
	'pages.home.meta_title':
		'Ayuda para la regularización extraordinaria 2026 en España | Primer Paso',
	'pages.home.meta_description':
		'Primer Paso ayuda a entender el proceso extraordinario de regularización en España, revisar qué documentos pueden faltar y decidir si conviene usar el portal oficial o buscar apoyo de una organización colaboradora.',
	'pages.home.lead':
		'Sigue estos tres pasos para preparar tu solicitud. Marca cada paso al completarlo.',
	'pages.home.steps.step_label': 'Paso {current} de {total}',
	'pages.home.steps.toggle_aria': 'Marcar paso como completado',
	'pages.home.steps.eligibility.title': 'Conoce tu primer paso',
	'pages.home.steps.eligibility.description':
		'Responde un cuestionario breve para saber qué vía encaja con tu situación, qué documentos ya tienes y cuáles te faltan.',
	'pages.home.steps.eligibility.hint':
		'Este paso se marca automáticamente al terminar el cuestionario — o puedes marcarlo a mano.',
	'pages.home.steps.eligibility.cta': 'Empezar el cuestionario',
	'pages.home.steps.eligibility.cta_again': 'Revisar el cuestionario',
	'pages.home.clear_progress_action': 'Borrar mi progreso',
	'pages.home.clear_confirm.title': '¿Borrar tu progreso?',
	'pages.home.clear_confirm.description':
		'Esto restablecerá tus respuestas guardadas y los documentos marcados en este dispositivo.',
	'pages.home.clear_confirm.confirm': 'Sí, borrar progreso',
	'pages.home.clear_confirm.cancel': 'Cancelar',
	'pages.home.steps.documents.title': 'Reúne los documentos',
	'pages.home.steps.documents.description_personalised':
		'Lista personalizada según tus respuestas. Marca los documentos que ya tienes.',
	'pages.home.steps.documents.description_generic':
		'Estos son documentos que suelen pedirse. Completa el cuestionario para ver una lista personalizada.',
	'pages.home.steps.documents.empty':
		'Aún no hay documentos. Completa el cuestionario para ver cuáles pueden aplicarte.',
	'pages.home.steps.submission.title': 'Presenta tu solicitud',
	'pages.home.steps.submission.digital_intro':
		'Si tienes identidad digital, puedes presentarla por el portal oficial.',
	'pages.home.steps.submission.collaborating_intro':
		'Si no, puedes presentarla con el apoyo de una organización colaboradora.',
	'pages.home.official_portal_action': 'Portal oficial de regularización',
	'pages.organisations.meta_title': 'Buscar organizaciones',
	'pages.organisations.meta_description':
		'Explora organizaciones colaboradoras por nombre, provincia y datos de contacto.',
	'pages.organisations.title': 'Buscar una organización colaboradora',
	'pages.organisations.lead':
		'Explora el directorio público sin completar el orientador. Busca por nombre, ubicación o datos de contacto.',
	'pages.organisations.search_label': 'Buscar',
	'pages.organisations.search_placeholder':
		'Buscar por nombre, lugar, teléfono, correo o sitio web',
	'pages.organisations.apply_filters': 'Aplicar filtros',
	'pages.organisations.clear': 'Limpiar',
	'pages.organisations.summary.one': '{count} organización encontrada',
	'pages.organisations.summary.many': '{count} organizaciones encontradas',
	'pages.organisations.empty_title': 'Ninguna organización coincide con estos filtros',
	'pages.organisations.empty_body':
		'Prueba una búsqueda más amplia o revisa el directorio completo.',
	'pages.organisations.guidance_title': '¿Necesitas orientación personalizada primero?',
	'pages.organisations.guidance_body':
		'Si no tienes claro por dónde empezar, usa el orientador y después vuelve al directorio.',
	'pages.organisations.action.view_details': 'Ver detalles',
	'pages.organisations.action.browse_all': 'Ver todas las organizaciones',
	'pages.organisations.action.start_screener': 'Empezar el orientador',
	'pages.organisations.detail.meta_has_phone': 'Teléfono disponible',
	'pages.organisations.detail.meta_has_website': 'Sitio web disponible',
	'pages.organisations.detail.lead':
		'Revisa los canales de contacto y el horario antes de comunicarte con esta organización.',
	'pages.organisations.detail.contact_title': 'Datos de contacto',
	'pages.organisations.detail.opening_hours_title': 'Horario de atención',
	'pages.organisations.detail.guidance_body':
		'Usa esta ficha para elegir la forma de contacto más segura para tu situación.',
	'pages.start.title': 'Revisa qué apoyo podrías necesitar para el proceso de regularización',
	'pages.start.lead': 'Usa este cuestionario para entender cuál podría ser tu siguiente paso.',
	'pages.start.not_official': 'Esta no es la solicitud oficial del gobierno.',
	'pages.start.window_open':
		'La ventana oficial de solicitud está abierta hasta el 30 de junio de 2026.',
	'pages.start.resume': 'Puedes parar y volver más tarde.',
	'pages.start.what_to_expect_title': 'Qué esperar',
	'pages.start.expectation.duration': 'entre 5 y 8 minutos',
	'pages.start.expectation.one_question': 'una pregunta a la vez',
	'pages.start.expectation.review': 'un paso de revisión antes del resultado',
	'pages.start.expectation.timeline':
		'si estabas en España antes del 1 de enero de 2026 y permaneciste en España durante todo el periodo de 5 meses antes de presentar la solicitud',
	'pages.start.start_now': 'Empezar el cuestionario',
	'pages.check_answers.title': 'Revisa tus respuestas',
	'pages.check_answers.hint':
		'Revisa estas respuestas antes de continuar. Puedes cambiar cualquier respuesta.',
	'pages.handover.summary_title': 'Resumen',
	'pages.handover.title': 'Resumen para guardar, imprimir o compartir',
	'pages.handover.body':
		'Usa este resumen para guardar una copia de tus respuestas o para compartirla con una persona de apoyo de confianza o una entidad colaboradora.',
	'pages.handover.reference': 'Número de referencia: {sessionId}',
	'pages.handover.generated_at': 'Generado: {generatedAt}',
	'pages.handover.generated_by': 'Generado por Primer Paso (primerpaso.org)',
	'pages.handover.links_title': 'Enlaces útiles',
	'pages.handover.link.official_portal': 'Portal oficial de regularización',
	'pages.handover.link.collaborators_pdf': 'Lista oficial de entidades colaboradoras',
	'pages.handover.checklist_title': 'Qué conviene preparar',
	'pages.handover.answers_title': 'Tus respuestas',
	'pages.handover.flags_title': 'Puntos que pueden necesitar atención',
	'pages.result.eligibility_title': 'Tu resultado',
	'pages.result.recommended_route_title': 'Vía recomendada',
	'pages.result.other_possible_routes_title': 'Otras vías que también podrían aplicar',
	'pages.result.next_step_title': 'Tu siguiente paso',
	'pages.result.next_step.prepare_documents.body':
		'Prepara los documentos que apoyan tu vía. Usa la lista de abajo para ver lo que ya tienes y lo que aún podrías necesitar.',
	'pages.result.next_step.vulnerability.body':
		'Prepara el certificado o informe que explique tu situación de vulnerabilidad. Puedes empezar creando un borrador para llevarlo a servicios sociales o a una entidad colaboradora acreditada.',
	'pages.result.next_step.specialist_review.body':
		'Tus respuestas sugieren que sería más seguro revisar tu situación antes de presentar la solicitud. Contacta con una entidad colaboradora acreditada si es posible y lleva este resumen.',
	'pages.result.next_step.not_this_process.body':
		'Revisa tus respuestas de nuevo, especialmente las fechas y el tiempo de estancia. Si son correctas, puede que este proceso de regularización no sea el adecuado para tu situación.',
	'pages.result.create_certificate_action': 'Crear certificado de vulnerabilidad',
	'pages.result.checklist.empty_eligible':
		'No se identificaron documentos pendientes a partir de tus respuestas. Ten preparados tus documentos de identidad, residencia y los documentos específicos de tu vía antes de presentar la solicitud.',
	'pages.result.why_title': 'Por qué pensamos esto',
	'pages.result.continue_title': 'Cómo continuar',
	'pages.result.continue_body':
		'Sigue con tu solicitud y marca cada paso al completarlo. Allí podrás revisar y marcar tus documentos.',
	'pages.result.continue_action': 'Ir a mi solicitud',
	'pages.result.review_documents_action': 'Revisar qué documentos me hacen falta',
	'pages.result.review_documents_body':
		'Continúa con la lista de documentos en el inicio — ahora está personalizada según tus respuestas.',
	'pages.result.summary_actions_title': 'Tu resumen',
	'pages.result.summary_actions_body':
		'Puedes guardar este resumen para consultarlo más tarde o reiniciar el cuestionario.',
	'pages.result.checklist_title': 'Qué conviene preparar',
	'pages.result.checklist.already_have': 'Lo que ya tienes',
	'pages.result.checklist.still_need': 'Lo que aún podrías necesitar',
	'pages.result.checklist.discuss_with_support': 'Qué conviene preguntar cuando recibas apoyo',
	'pages.result.checklist.unresolved': 'Qué conviene revisar o explicar',
	'pages.result.route.official_portal_body':
		'Usa el portal oficial del gobierno para el proceso de regularización. Si primero necesitas ayuda, también puedes llevar este resumen a una entidad colaboradora.',
	'pages.result.route.collaborating_organisation_body':
		'Empieza por la lista oficial de entidades colaboradoras. Lleva este resumen para que no tengan que empezar de cero.',
	'pages.result.handover_title': 'Guardar, imprimir o compartir tu resumen',
	'pages.result.handover.body':
		'Guarda una copia de tus respuestas. También puedes llevar este resumen a una persona de apoyo de confianza o a una entidad colaboradora.',
	'pages.result.how_to_apply_title': 'Antes de solicitar',
	'pages.result.how_to_apply.body':
		'Usa el canal oficial del gobierno y no lo dejes para el último momento.',
	'pages.result.how_to_apply.hint':
		'La ventana oficial de solicitud está abierta hasta el 30 de junio de 2026.',
	'pages.result.another_route.do_now_title': 'Qué hacer ahora',
	'pages.result.another_route.do_now.body':
		'Revisa tus respuestas otra vez, especialmente tus fechas y tu cronología. Si están correctas, guarda este resumen y haz una pausa antes de seguir por esta vía.',
	'pages.result.another_route.support_body':
		'Si tus respuestas están correctas y todavía necesitas ayuda, puede que te convenga buscar orientación personalizada antes de dar el siguiente paso.',
	'pages.result.support_title': 'Recibir apoyo',
	'pages.result.collaborating_cta.hint':
		'Usa el directorio de organizaciones para encontrar una entidad colaboradora que pueda ayudarte.',
	'pages.result.collaborating_cta.title': 'Buscar una organización colaboradora',
	'pages.result.collaborating_cta.lead':
		'Explora el directorio público de organizaciones colaboradoras sin repetir el cuestionario.',
	'steps.completion_mode.title': '¿Para quién estás completando esto?',
	'steps.completion_mode.hint': 'Elige la opción que mejor describa esta sesión.',
	'steps.completion_mode.check_answers_label': 'Para quién estás completando esto',
	'steps.completion_mode.error': 'Elige para quién estás completando esto.',
	'steps.completion_mode.options.self': 'Para mí',
	'steps.completion_mode.options.someone_else': 'Para otra persona, con su permiso',
	'steps.completion_mode.options.support_worker': 'Soy trabajador/a de apoyo o voluntario/a',
	'steps.presence_before_cutoff.title': '¿Ya vivías en España antes del 1 de enero de 2026?',
	'steps.presence_before_cutoff.check_answers_label':
		'Vivir en España antes del 1 de enero de 2026',
	'steps.presence_before_cutoff.error':
		'Elige si ya vivías en España antes del 1 de enero de 2026.',
	'steps.common.options.yes': 'Sí',
	'steps.common.options.no': 'No',
	'steps.common.options.not_sure': 'No estoy seguro/a',
	'steps.common.options.none': 'Ninguna de estas',
	'steps.asylum_history.title': '¿Solicitaste asilo o protección internacional en España?',
	'steps.asylum_history.check_answers_label': 'Asilo o protección internacional en España',
	'steps.asylum_history.error': 'Elige si solicitaste asilo o protección internacional en España.',
	'steps.asylum_before_cutoff.title': '¿Esa solicitud fue antes del 1 de enero de 2026?',
	'steps.asylum_before_cutoff.check_answers_label':
		'Asilo o protección internacional antes del 1 de enero de 2026',
	'steps.asylum_before_cutoff.error': 'Elige si esa solicitud fue antes del 1 de enero de 2026.',
	'steps.five_month_stay.title':
		'En los 5 meses antes de que pienses presentar la solicitud, ¿has permanecido en España todo el tiempo?',
	'steps.five_month_stay.body':
		'Responde sobre los 5 meses anteriores a la fecha en que esperas presentar.',
	'steps.five_month_stay.check_answers_label':
		'Permanecí en España durante todo el periodo de 5 meses',
	'steps.five_month_stay.error': 'Elige la respuesta que mejor encaje con tu situación.',
	'steps.five_month_stay.options.left_spain': 'No, en algún momento salí de España',
	'steps.asylum_documents.title': '¿Tienes algún documento sobre tu caso de asilo o protección?',
	'steps.asylum_documents.hint':
		'Por ejemplo, un resguardo de presentación, documento del caso, carta o notificación.',
	'steps.asylum_documents.check_answers_label': 'Documentos sobre tu caso de asilo o protección',
	'steps.asylum_documents.error': 'Elige si tienes documentos sobre tu caso de asilo o protección.',
	'steps.work_situation.title': '¿Alguna de estas opciones describe tu situación laboral?',
	'steps.work_situation.check_answers_label': 'Situación laboral',
	'steps.work_situation.options.worked_in_spain': 'He trabajado en España',
	'steps.work_situation.options.job_offer': 'Tengo una oferta de trabajo',
	'steps.work_situation.options.want_to_work_for_myself': 'Quiero trabajar por cuenta propia',
	'steps.family_situation.title':
		'¿Alguna de estas opciones describe tu situación familiar en España?',
	'steps.family_situation.check_answers_label': 'Situación familiar en España',
	'steps.family_situation.options.child_under_18': 'Vivo con mi hijo o hija menor de 18 años',
	'steps.family_situation.options.adult_child_support_needs':
		'Vivo con mi hijo o hija adulto/a que necesita mucho apoyo por discapacidad o problemas de salud',
	'steps.family_situation.options.mother_or_father': 'Vivo con mi madre o mi padre',
	'steps.vulnerability_situation.title':
		'¿Alguna de estas situaciones hace que tu caso sea especialmente difícil?',
	'steps.vulnerability_situation.hint':
		'Marca las que te parezcan relevantes. Esto solo ayuda a decidir si conviene revisar la vía de vulnerabilidad con una entidad o con servicios sociales.',
	'steps.vulnerability_situation.check_answers_label':
		'Situaciones que podrían requerir revisión por la vía de vulnerabilidad',
	'vulnerability.applicant.social_isolation_or_lack_of_support_network':
		'No tengo personas o servicios en los que pueda apoyarme',
	'vulnerability.applicant.homelessness_or_precarious_housing':
		'No tengo una vivienda estable o segura',
	'vulnerability.applicant.discrimination_or_social_exclusion':
		'Siento que sufro exclusión, discriminación o trato injusto',
	'vulnerability.applicant.insufficient_income':
		'No tengo ingresos suficientes para cubrir mis necesidades básicas',
	'vulnerability.applicant.poverty_or_economic_exclusion_risk':
		'Estoy en riesgo de pobreza o de una dificultad económica grave',
	'vulnerability.applicant.difficulty_accessing_employment':
		'Me está costando mucho conseguir o mantener un trabajo',
	'vulnerability.applicant.dependants': 'Tengo hijos, hijas u otras personas a mi cargo',
	'vulnerability.applicant.vulnerable_family_unit':
		'La situación de mi familia o unidad de convivencia es especialmente difícil',
	'vulnerability.applicant.single_parent_precarity':
		'Crío hijos o hijas sin pareja y en circunstancias difíciles',
	'vulnerability.applicant.psychosocial_risks':
		'El estrés, el trauma, la salud mental o los problemas sociales están empeorando mi situación',
	'vulnerability.applicant.exploitation_or_abuse':
		'He vivido explotación, abuso, amenazas o presión',
	'steps.identity_documents.title': '¿Qué documentos de identidad tienes?',
	'steps.identity_documents.check_answers_label': 'Documentos de identidad',
	'steps.identity_documents.error': 'Elige al menos una opción.',
	'steps.identity_documents.options.current_passport': 'Pasaporte vigente',
	'steps.identity_documents.options.expired_passport': 'Pasaporte vencido',
	'steps.identity_documents.options.national_identity_card': 'Documento nacional de identidad',
	'steps.identity_documents.options.asylum_document': 'Documento de asilo',
	'steps.identity_documents.options.travel_document': 'Documento de viaje',
	'steps.identity_documents.options.no_identity_documents_now':
		'No tengo documentos de identidad conmigo ahora',
	'steps.identity_documents.options.prefer_not_to_say': 'Prefiero no decirlo',
	'steps.previous_residence_countries.title':
		'¿En qué países has vivido durante los últimos cinco años?',
	'steps.previous_residence_countries.body':
		'Agrega cualquier otro país donde hayas vivido durante este periodo.',
	'steps.previous_residence_countries.hint':
		'Normalmente necesitarás certificados de antecedentes penales de los países seleccionados fuera de España.',
	'steps.previous_residence_countries.error': 'España debe permanecer seleccionada.',
	'steps.previous_residence_countries.check_answers_label':
		'Países donde viviste durante los últimos cinco años',
	'steps.previous_residence_countries.search_label': 'Buscar en todos los países',
	'steps.previous_residence_countries.spain_locked_label': 'España',
	'steps.previous_residence_countries.spain_locked_hint': 'Ya incluida. No se puede quitar.',
	'steps.previous_residence_countries.common_countries_label': 'Países comunes',
	'steps.previous_residence_countries.all_other_countries': 'Todos los demás países',
	'steps.previous_residence_countries.search_results': 'Resultados de búsqueda',
	'steps.criminal_record_certificates.title':
		'¿Cuál es el estado de cada certificado de antecedentes penales?',
	'steps.criminal_record_certificates.body':
		'Indica si ya tienes el certificado, si lo solicitaste y estás esperando, si todavía no lo has solicitado o si no estás seguro/a.',
	'steps.criminal_record_certificates.hint':
		'Si solicitaste un certificado, guarda el comprobante de la solicitud.',
	'steps.criminal_record_certificates.error':
		'Responde las preguntas sobre el certificado para cada país.',
	'steps.criminal_record_certificates.check_answers_label':
		'Estado del certificado de antecedentes penales',
	'steps.criminal_record_certificates.check_answers.entry': '{country}: {status}',
	'steps.criminal_record_certificates.options.already_have': 'Ya lo tengo',
	'steps.criminal_record_certificates.options.requested_waiting': 'Lo solicité y estoy esperando',
	'steps.criminal_record_certificates.options.not_requested_yet': 'Todavía no lo he solicitado',
	'steps.criminal_record_certificates.options.not_sure': 'No estoy seguro/a',
	'results.criminal_records.title': 'Preparación de certificados de antecedentes penales',
	'results.criminal_records.intro':
		'Los antecedentes penales en España los revisa la administración. Para otros países donde viviste durante el periodo relevante, normalmente necesitarás un certificado de antecedentes penales.',
	'results.criminal_records.status.already_have': 'Indicaste que ya tienes este certificado.',
	'results.criminal_records.status.requested_waiting':
		'Indicaste que solicitaste este certificado y estás esperando.',
	'results.criminal_records.status.not_requested_yet':
		'Indicaste que este certificado todavía no se ha solicitado.',
	'results.criminal_records.status.not_sure': 'No estás seguro/a sobre este certificado.',
	'results.criminal_records.status.unknown': 'La información del país falta o no está clara.',
	'results.criminal_records.next_actions.request_criminal_record_certificate_today':
		'Solicita este certificado lo antes posible.',
	'results.criminal_records.next_actions.save_certificate_request_proof':
		'Guarda el comprobante de que solicitaste el certificado.',
	'results.criminal_records.next_actions.wait_until_one_month_then_prepare_fallback':
		'Si pasa un mes y no ha llegado, prepara la información alternativa antes de pedir ayuda.',
	'results.criminal_records.next_actions.ask_specialist_about_criminal_record_certificate':
		'Pide a un/a especialista u organización registrada que revise esto antes de presentar la solicitud.',
	'results.criminal_records.status_label': 'Estado',
	'results.criminal_records.next_action_label': 'Siguiente acción',
	'pages.handover.criminal_records.title': 'Preparación de certificados de antecedentes penales',
	'pages.handover.criminal_records.country': 'País',
	'pages.handover.criminal_records.status': 'Estado',
	'pages.handover.criminal_records.next_actions': 'Siguientes acciones',
	'steps.evidence_before_cutoff.title':
		'¿Tienes algún documento que pueda ayudar a mostrar que ya vivías en España antes de enero de 2026?',
	'steps.evidence_before_cutoff.check_answers_label':
		'Documentos que podrían mostrar residencia antes de enero de 2026',
	'steps.evidence_before_cutoff.error': 'Elige al menos una opción.',
	'steps.evidence_before_cutoff.options.padron_or_registration': 'Empadronamiento o registro',
	'steps.evidence_before_cutoff.options.housing_papers': 'Documentos de vivienda',
	'steps.evidence_before_cutoff.options.health_or_pharmacy':
		'Documentos de salud, citas médicas o recetas de farmacia',
	'steps.evidence_before_cutoff.options.school_or_childcare':
		'Documentos escolares o de cuidado infantil',
	'steps.evidence_before_cutoff.options.work_papers': 'Documentos de trabajo',
	'steps.evidence_before_cutoff.options.organisation_or_church_letter':
		'Cartas de una organización, iglesia o trabajador/a social',
	'steps.evidence_before_cutoff.options.travel_or_transport': 'Documentos de viaje o transporte',
	'steps.evidence_before_cutoff.options.something_else_dated_named':
		'Otro documento con fecha y mi nombre',
	'steps.evidence_before_cutoff.options.none_yet': 'Todavía no tengo ninguno de estos',
	'steps.evidence_recent_months.title':
		'¿Tienes algún documento de los últimos 5 meses que pueda ayudar a mostrar que has estado viviendo aquí recientemente?',
	'steps.evidence_recent_months.hint':
		'Recuerda que puedes presentar cualquier documento, papel o ticket que tenga tu nombre y la fecha',
	'steps.evidence_recent_months.check_answers_label': 'Documentos de los últimos 5 meses',
	'steps.evidence_recent_months.error': 'Elige al menos una opción.',
	'steps.evidence_recent_months.options.housing_papers': 'Documentos de vivienda',
	'steps.evidence_recent_months.options.health_or_pharmacy':
		'Documentos de salud, citas médicas o recetas de farmacia',
	'steps.evidence_recent_months.options.school_or_childcare':
		'Documentos escolares o de cuidado infantil',
	'steps.evidence_recent_months.options.work_papers': 'Documentos de trabajo',
	'steps.evidence_recent_months.options.organisation_or_church_letter':
		'Cartas de una organización, iglesia o trabajador/a social',
	'steps.evidence_recent_months.options.bank_or_money_transfer':
		'Registros bancarios o justificantes de envío de dinero',
	'steps.evidence_recent_months.options.travel_or_dated_receipts': 'Viajes o recibos con fecha',
	'steps.evidence_recent_months.options.something_else_dated_named':
		'Otro documento con fecha y mi nombre',
	'steps.evidence_recent_months.options.none_yet': 'Todavía no tengo ninguno de estos',
	'steps.specialist_flags.title':
		'¿Hay algo que convendría revisar con una persona especialista antes de solicitar?',
	'steps.specialist_flags.check_answers_label': 'Algo que pueda requerir asesoría especializada',
	'steps.specialist_flags.options.criminal_record_worry':
		'Me preocupa tener antecedentes penales o una causa penal',
	'steps.specialist_flags.options.identity_missing_or_mismatch':
		'Mis documentos de identidad faltan o mis datos no coinciden entre documentos',
	'steps.specialist_flags.options.previous_refusal_needs_help':
		'Tuve una denegación en otro trámite y necesito ayuda para entenderla',
	'steps.specialist_flags.options.asylum_case_not_clear':
		'No estoy seguro/a de qué pasó con mi caso de asilo',
	'steps.specialist_flags.options.unsafe_sharing_digitally':
		'No me siento seguro/a compartiendo cierta información de forma digital',
	'steps.specialist_flags.options.urgent_human_support': 'Necesito apoyo humano urgente',
	'steps.specialist_flags.options.want_specialist':
		'Prefiero hablar de esto con una persona especialista',
	'steps.support_needs.title': '¿Qué tipo de ayuda podrías necesitar?',
	'steps.support_needs.error':
		'Elige una opción o selecciona «No necesito ayuda por ahora» o «No estoy seguro/a».',
	'steps.support_needs.check_answers_label': 'Apoyo que podrías necesitar',
	'steps.support_needs.options.another_language': 'Ayuda en otro idioma',
	'steps.support_needs.options.in_person_help': 'Ayuda presencial',
	'steps.support_needs.options.help_using_phone_or_computer':
		'Ayuda para usar un teléfono o un ordenador',
	'steps.support_needs.options.phone_support': 'Apoyo por teléfono',
	'steps.support_needs.options.help_scanning_or_printing':
		'Ayuda para escanear o imprimir documentos',
	'steps.support_needs.options.help_gathering_papers': 'Ayuda para entender qué documentos reunir',
	'steps.support_needs.options.child_or_dependant_support':
		'Ayuda también para niños, niñas o personas dependientes',
	'steps.support_needs.options.specialist_advice': 'Asesoría especializada',
	'steps.support_needs.options.none': 'No necesito ayuda por ahora',
	'steps.province.title': '¿En qué provincia estás?',
	'steps.province.hint': 'Esto nos ayuda a mostrarte opciones de apoyo cerca de ti.',
	'steps.province.check_answers_label': 'Provincia',
	'steps.province.error': 'Elige una provincia.',
	'result.reason.after_cutoff': 'Dijiste que aún no vivías en España antes del 1 de enero de 2026.',
	'result.reason.specialist_review':
		'Una o más de tus respuestas sugieren que sería más seguro recibir apoyo antes de solicitar.',
	'result.reason.specialist_review_criminal_record':
		'Dijiste que podrías tener una preocupación por antecedentes penales. Sería más seguro revisarlo con apoyo antes de solicitar.',
	'result.reason.specialist_review_identity':
		'Dijiste que podrían faltar datos de identidad o no coincidir. Sería más seguro revisarlo con apoyo antes de solicitar.',
	'result.reason.not_enough_information':
		'Algunos detalles importantes sobre tus fechas o tu situación siguen sin estar claros.',
	'result.reason.more_evidence':
		'Tus respuestas podrían encajar con esta vía, pero quizá necesites más documentos para respaldar la solicitud.',
	'result.reason.likely_in_scope':
		'Tus respuestas sugieren que tus fechas y tus documentos podrían encajar con esta vía.',
	'result.explanation.after_cutoff':
		'Según tus respuestas, probablemente esta vía no sea la mejor opción porque es posible que no se cumpla la fecha límite.',
	'result.explanation.specialist_review':
		'Tus respuestas sugieren que una persona especialista debería revisar tu situación antes del siguiente paso.',
	'result.explanation.not_enough_information':
		'Todavía no hay suficiente información para sugerir el mejor siguiente paso.',
	'result.explanation.more_evidence':
		'Según tus respuestas, esta vía podría encajar con tu situación, pero quizás necesites más documentos antes de solicitar.',
	'result.explanation.likely_in_scope':
		'Tus respuestas sugieren que podrías poder usar este proceso de regularización.',
	'result.flag.uncertain_timeline': 'La cronología es incierta',
	'result.flag.five_month_requirement_risk': 'Posible riesgo de continuidad',
	'result.flag.hard_gate_after_cutoff': 'El inicio de residencia es posterior a la fecha límite',
	'result.flag.criminal_record_concern': 'Posible preocupación por antecedentes penales',
	'result.flag.identity_issue': 'Problema de identidad',
	'result.flag.asylum_complexity': 'Posible complejidad relacionada con asilo',
	'result.flag.missing_identity_documents': 'Faltan documentos de identidad',
	'result.flag.continuity_concern': 'Preocupación por continuidad',
	'result.flag.family_support_needs': 'Necesidades de apoyo para familia o personas dependientes',
	'result.checklist.item.identity_document_available':
		'Un documento de identidad que puedes mostrar.',
	'result.checklist.item.asylum_case_documents_available':
		'Documentos sobre tu caso de asilo o protección.',
	'result.checklist.item.before_cutoff_evidence_available':
		'Documentos que pueden ayudar a mostrar que estabas en España antes de enero de 2026.',
	'result.checklist.item.recent_evidence_available': 'Documentos recientes de los últimos 5 meses.',
	'result.checklist.item.continuity_answer_positive':
		'Una estancia reciente en España que podría encajar con esta vía.',
	'result.checklist.item.identity_document_needed':
		'Un documento de identidad que puedas usar para la solicitud.',
	'result.checklist.item.before_cutoff_evidence_needed':
		'Documentos fechados que muestren que estabas en España antes de enero de 2026.',
	'result.checklist.item.recent_evidence_needed': 'Documentos recientes de los últimos 5 meses.',
	'result.checklist.item.asylum_case_documents_needed':
		'Cualquier documento que todavía tengas sobre un caso de asilo o protección, si eso aplica a tu situación.',
	'result.checklist.item.official_document_requirements':
		'Certificado de antecedentes penales si aplica a tu caso.',
	'result.checklist.item.practical_support_helpful':
		'Ayuda con el idioma, el acceso digital, escanear, imprimir o entender qué documentos importan.',
	'result.checklist.item.complex_case_review':
		'Cualquier preocupación sobre antecedentes penales, identidad, historial de asilo o compartir información de forma segura.',
	'result.checklist.item.another_route_advice': 'Si otra vía de inmigración podría encajar mejor.',
	'result.checklist.item.confirm_timeline':
		'Si ya estabas en España antes del 1 de enero de 2026 y si permaneciste en España durante todo el periodo de 5 meses antes de presentar la solicitud.',
	'result.checklist.item.continuity_concern':
		'Cualquier laguna o ausencia durante los últimos 5 meses.',
	'result.checklist.item.identity_issue_to_explain':
		'Cualquier documento de identidad que falte o datos que no coincidan.',
	'result.checklist.item.asylum_history_to_explain':
		'Qué ocurrió en cualquier proceso de asilo o protección en España.',
	'result.title.needs_specialist_review':
		'Busca apoyo especializado antes de presentar la solicitud',
	'result.title.eligible': 'Vía recomendada encontrada',
	'result.title.not_this_process': 'Este proceso puede no encajar',
	'result.eligibility_route.international_protection':
		'Vía de protección internacional / solicitante de asilo',
	'result.eligibility_route.family_unit': 'Vía de unidad familiar',
	'result.eligibility_route.work_or_intention': 'Vía de trabajo o intención de trabajar',
	'result.eligibility_route.vulnerability': 'Vía de vulnerabilidad',
	'result.explanation.international_protection':
		'Según tus respuestas, la vía de protección internacional / solicitante de asilo parece la más clara para revisar primero.',
	'result.explanation.family_unit':
		'Según tus respuestas, la vía de unidad familiar parece la más clara para revisar primero.',
	'result.explanation.work_or_intention':
		'Según tus respuestas, la vía de trabajo o intención de trabajar parece la más clara para revisar primero.',
	'result.explanation.vulnerability':
		'Según tus respuestas, puede convenir revisar la vía de vulnerabilidad con una entidad o con servicios sociales. Esta vía suele requerir un certificado de vulnerabilidad firmado o sellado por un organismo habilitado.',
	'result.explanation.needs_specialist_review':
		'Tus respuestas no encajan claramente en una sola vía. Una organización especializada debería revisar tu caso antes de presentar la solicitud.',
	'result.explanation.not_this_process':
		'Según tus respuestas, este proceso de regularización puede no ser el proceso adecuado.',
	'result.reason.not_present_before_cutoff':
		'Respondiste que no estabas en España antes de la fecha límite.',
	'result.reason.five_month_stay_not_met':
		'Respondiste que saliste de España durante los cinco meses anteriores a la solicitud.',
	'result.reason.specialist_flags':
		'Seleccionaste un asunto que debería revisar un especialista antes de presentar la solicitud.',
	'result.reason.no_clear_route':
		'Las respuestas aún no muestran una vía clara familiar, laboral, de vulnerabilidad o de protección internacional.',
	'result.submission_path.registered_entity_online':
		'El mejor siguiente paso es contactar, si es posible, con una entidad colaboradora registrada. Puede ayudarte a preparar y presentar la solicitud por vía electrónica.',
	'result.submission_path.specialist_review_first':
		'Contacta con una organización colaboradora registrada si es posible. Lleva este resumen para que puedan revisar tu situación antes de presentar la solicitud.'
} satisfies Partial<Record<MessageKey, string>>
