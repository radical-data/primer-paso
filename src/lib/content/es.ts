import type { MessageKey } from './index'

export const es = {
	'common.not_answered': 'Sin responder',
	'common.choose_an_option': 'Elige una opción',
	'common.choose_month': 'Elige un mes',
	'common.choose_one_answer': 'Elige una respuesta',
	'common.choose_all_that_apply': 'Elige todas las que correspondan',
	'common.continue': 'Continuar',
	'common.back': 'Volver',
	'common.problem': 'Hay un problema',
	'chrome.app_title': 'Primer Paso',
	'chrome.meta_description':
		'Primer Paso es un cuestionario inicial para el proceso extraordinario de regularización de España de 2026. Está alojado en primerpaso.org.',
	'chrome.brand': 'Primer Paso',
	'chrome.primary_navigation': 'Principal',
	'chrome.nav.home': 'Inicio',
	'chrome.nav.start': 'Revisar tu siguiente paso',
	'chrome.nav.organisations': 'Buscar organizaciones',
	'chrome.language_switcher_label': 'Selector de idioma',
	'pages.home.eyebrow': 'Empezar',
	'pages.home.title': 'Elige cómo quieres empezar',
	'pages.home.lead':
		'Puedes usar el orientador para revisar tu siguiente paso o explorar directamente el directorio de organizaciones colaboradoras.',
	'pages.home.choose': 'Elige una opción',
	'pages.home.quiz_title': 'Revisar mi siguiente paso',
	'pages.home.quiz_body':
		'Responde unas preguntas para recibir una orientación cautelosa sobre qué vía puede encajar mejor contigo.',
	'pages.home.quiz_action': 'Empezar el orientador',
	'pages.home.directory_title': 'Buscar una organización colaboradora',
	'pages.home.directory_body':
		'Explora el directorio sin hacer el formulario. Busca por nombre, provincia o datos de contacto.',
	'pages.home.directory_action': 'Abrir directorio',
	'pages.home.note_title': 'Antes de empezar',
	'pages.home.note_body':
		'Este servicio ofrece orientación práctica. No sustituye el asesoramiento jurídico ni una decisión oficial.',
	'pages.start.eyebrow': 'Hito 1',
	'pages.organisations.meta_title': 'Buscar organizaciones',
	'pages.organisations.meta_description':
		'Explora organizaciones colaboradoras por nombre, provincia y datos de contacto.',
	'pages.organisations.eyebrow': 'Organizaciones colaboradoras',
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
	'pages.organisations.summary.with_website': '{count} con sitio web',
	'pages.organisations.summary.with_phone': '{count} con teléfono',
	'pages.organisations.summary.with_email': '{count} con correo electrónico',
	'pages.organisations.badge.website': 'sitio web disponible',
	'pages.organisations.badge.phone': 'teléfono disponible',
	'pages.organisations.badge.email': 'correo disponible',
	'pages.organisations.empty_title': 'Ninguna organización coincide con estos filtros',
	'pages.organisations.empty_body':
		'Prueba una búsqueda más amplia o revisa el directorio completo.',
	'pages.organisations.guidance_title': '¿Necesitas orientación personalizada primero?',
	'pages.organisations.guidance_body':
		'Si no tienes claro por dónde empezar, usa el orientador y después vuelve al directorio.',
	'pages.organisations.action.visit_website': 'Visitar sitio web',
	'pages.organisations.action.email': 'Enviar correo',
	'pages.organisations.action.call': 'Llamar',
	'pages.organisations.action.browse_all': 'Ver todas las organizaciones',
	'pages.organisations.action.start_screener': 'Empezar el orientador',
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
	'pages.check_answers.eyebrow': 'Revisión',
	'pages.check_answers.title': 'Revisa tus respuestas',
	'pages.check_answers.hint':
		'Revisa estas respuestas antes de continuar. Puedes cambiar cualquier respuesta.',
	'pages.check_answers.change': 'Cambiar',
	'pages.check_answers.see_result': 'Ver resultado',
	'pages.check_answers.back': 'Volver',
	'pages.handover.eyebrow': 'Resumen',
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
	'pages.handover.next_step_title': 'Siguiente paso recomendado',
	'pages.handover.checklist_title': 'Qué conviene preparar',
	'pages.handover.answers_title': 'Tus respuestas',
	'pages.handover.flags_title': 'Puntos que pueden necesitar atención',
	'pages.handover.action.print': 'Imprimir este resumen',
	'pages.handover.action.back_to_result': 'Volver al resultado',
	'pages.result.eyebrow': 'Resultado',
	'pages.result.eligibility_title': 'Elegibilidad probable',
	'pages.result.eligibility.likely_in_scope':
		'Según tus respuestas, esta vía de regularización podría encajar con tu situación.',
	'pages.result.eligibility.possible_but_needs_more_evidence':
		'Según tus respuestas, esta vía podría encajar, pero quizá necesites más documentos antes de solicitar.',
	'pages.result.eligibility.needs_specialist_review':
		'Según tus respuestas, esta vía podría seguir encajando, pero sería más seguro revisarla con apoyo antes de solicitar.',
	'pages.result.eligibility.not_enough_information_yet':
		'Aún no está claro si esta vía encaja, porque falta información importante o sigue siendo incierta.',
	'pages.result.eligibility.another_route_may_fit_better':
		'Según tus respuestas, otra vía de inmigración podría encajar mejor.',
	'pages.result.next_step_title': 'Tu siguiente paso',
	'pages.result.next_step.official_portal':
		'Ve al portal oficial de regularización cuando estés listo/a para continuar.',
	'pages.result.next_step.collaborating_organisation':
		'Lleva este resumen a una entidad colaboradora antes de continuar.',
	'pages.result.next_step.collaborating_organisation_hint':
		'Abre la lista oficial y elige una entidad colaboradora que pueda revisar tu caso contigo.',
	'pages.result.why_title': 'Por qué pensamos esto',
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
	'pages.result.support_title': 'Recibir apoyo',
	'pages.result.support.body':
		'Este cuestionario no es asesoría legal. El apoyo disponible cerca de ti puede depender de tu provincia: {province}.',
	'pages.result.flags_title': 'Alertas detectadas',
	'pages.result.reference_title': 'Guarda esta referencia',
	'pages.result.reference_body': 'Número de referencia: {sessionId}',
	'pages.result.action.official_portal': 'Usar el portal oficial de regularización',
	'pages.result.action.open_official_portal': 'Abrir el portal oficial de regularización',
	'pages.result.action.open_collaborators_pdf': 'Abrir la lista oficial de entidades colaboradoras',
	'pages.result.action.collaborators_pdf': 'Ver la lista oficial de entidades colaboradoras',
	'pages.result.action.print_handover': 'Descargar PDF del resumen',
	'pages.result.action.download_handover_json': 'Descargar JSON del resumen',
	'pages.result.action.back_to_answers': 'Volver a las respuestas',
	'pages.result.action.start_again': 'Empezar de nuevo',
	'pages.confirmation.eyebrow': 'Confirmación',
	'pages.confirmation.title': 'Tu resultado está listo',
	'pages.confirmation.body':
		'Guarda esta página. Incluye tu número de referencia y una copia de tus respuestas.',
	'pages.confirmation.reference_number': 'Número de referencia',
	'pages.confirmation.updated': 'Actualizado',
	'pages.confirmation.hint': 'Guarda, imprime o haz una captura de esta página.',
	'pages.confirmation.action.view_answers': 'Ver tus respuestas',
	'pages.confirmation.action.back_to_result': 'Volver al resultado',
	'pages.confirmation.action.start_again': 'Empezar de nuevo',
	'eyebrows.session_setup': 'Para empezar',
	'eyebrows.eligibility': 'Elegibilidad',
	'eyebrows.route_split': 'Elegibilidad',
	'eyebrows.route_asylum': 'Documentos',
	'eyebrows.route_non_asylum': 'Elegibilidad',
	'eyebrows.identity': 'Documentos',
	'eyebrows.documents': 'Documentos',
	'eyebrows.evidence_cutoff': 'Documentos',
	'eyebrows.evidence_recent': 'Documentos',
	'eyebrows.specialist': 'Necesidades de apoyo',
	'eyebrows.routing': 'Necesidades de apoyo',
	'eyebrows.referral': 'Apoyo local',
	'eyebrows.support': 'Necesidades de apoyo',
	'eyebrows.contact': 'Cómo podemos contactarte',
	'months.january': 'Enero',
	'months.february': 'Febrero',
	'months.march': 'Marzo',
	'months.april': 'Abril',
	'months.may': 'Mayo',
	'months.june': 'Junio',
	'months.july': 'Julio',
	'months.august': 'Agosto',
	'months.september': 'Septiembre',
	'months.october': 'Octubre',
	'months.november': 'Noviembre',
	'months.december': 'Diciembre',
	'steps.language.title': 'Elige un idioma',
	'steps.language.hint': 'Puedes cambiar el idioma en cualquier momento sin perder tus respuestas.',
	'steps.language.check_answers_label': 'Idioma',
	'steps.language.error': 'Elige un idioma.',
	'steps.language.options.es': 'Español',
	'steps.language.options.en': 'English',
	'steps.language.options.ar': 'العربية',
	'steps.language.options.fr': 'Français',
	'steps.completion_mode.title': '¿Para quién estás completando esto?',
	'steps.completion_mode.hint': 'Elige la opción que mejor describa esta sesión.',
	'steps.completion_mode.check_answers_label': 'Para quién estás completando esto',
	'steps.completion_mode.error': 'Elige para quién estás completando esto.',
	'steps.completion_mode.options.self': 'Para mí',
	'steps.completion_mode.options.someone_else': 'Para otra persona, con su permiso',
	'steps.completion_mode.options.support_worker': 'Soy trabajador/a de apoyo o voluntario/a',
	'steps.presence_before_cutoff.title': '¿Ya vivías en España antes del 1 de enero de 2026?',
	'steps.presence_before_cutoff.hint':
		'Responde según si ya vivías en España antes de la fecha límite',
	'steps.presence_before_cutoff.check_answers_label':
		'Vivir en España antes del 1 de enero de 2026',
	'steps.presence_before_cutoff.error':
		'Elige si ya vivías en España antes del 1 de enero de 2026.',
	'steps.common.options.yes': 'Sí',
	'steps.common.options.no': 'No',
	'steps.common.options.not_sure': 'No estoy seguro/a',
	'steps.residence_start.title': '¿Cuándo empezaste a vivir en España?',
	'steps.residence_start.hint': 'Un mes aproximado es suficiente.',
	'steps.residence_start.check_answers_label': 'Cuándo empezaste a vivir en España',
	'steps.residence_start.error': 'Elige cuándo empezaste a vivir en España.',
	'steps.residence_start.month_error': 'Elige el mes o indica que no estás seguro/a del mes.',
	'steps.residence_start.options.2024_or_earlier': 'En 2024 o antes',
	'steps.residence_start.options.2025': 'En 2025',
	'steps.residence_start.options.2026': 'En 2026',
	'steps.residence_start.options.not_sure': 'No estoy seguro/a',
	'steps.residence_start.month_prompt': '¿Qué mes fue, aproximadamente?',
	'steps.residence_start.month_unknown': 'No estoy seguro/a del mes',
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
	'steps.work_situation.error': 'Elige al menos una opción.',
	'steps.work_situation.options.worked_in_spain': 'He trabajado en España',
	'steps.work_situation.options.job_offer': 'Tengo una oferta de trabajo',
	'steps.work_situation.options.want_to_work_for_myself': 'Quiero trabajar por cuenta propia',
	'steps.work_situation.options.none': 'Ninguna de estas',
	'steps.family_situation.title':
		'¿Alguna de estas opciones describe tu situación familiar en España?',
	'steps.family_situation.check_answers_label': 'Situación familiar en España',
	'steps.family_situation.error': 'Elige al menos una opción.',
	'steps.family_situation.options.child_under_18': 'Vivo con mi hijo o hija menor de 18 años',
	'steps.family_situation.options.adult_child_support_needs':
		'Vivo con mi hijo o hija adulto/a que necesita mucho apoyo por discapacidad o problemas de salud',
	'steps.family_situation.options.mother_or_father': 'Vivo con mi madre o mi padre',
	'steps.family_situation.options.none': 'Ninguna de estas',
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
	'steps.evidence_before_cutoff.title':
		'¿Tienes algún documento que pueda ayudar a mostrar que ya vivías en España antes de enero de 2026?',
	'steps.evidence_before_cutoff.check_answers_label':
		'Documentos que podrían mostrar residencia antes de enero de 2026',
	'steps.evidence_before_cutoff.error': 'Elige al menos una opción.',
	'steps.evidence_before_cutoff.options.padron_or_registration': 'Empadronamiento o registro',
	'steps.evidence_before_cutoff.options.housing_papers': 'Documentos de vivienda',
	'steps.evidence_before_cutoff.options.health_or_pharmacy': 'Documentos de salud o farmacia',
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
	'steps.evidence_recent_months.check_answers_label': 'Documentos de los últimos 5 meses',
	'steps.evidence_recent_months.error': 'Elige al menos una opción.',
	'steps.evidence_recent_months.options.housing_papers': 'Documentos de vivienda',
	'steps.evidence_recent_months.options.health_or_pharmacy': 'Documentos de salud o farmacia',
	'steps.evidence_recent_months.options.school_or_childcare':
		'Documentos escolares o de cuidado infantil',
	'steps.evidence_recent_months.options.work_papers': 'Documentos de trabajo',
	'steps.evidence_recent_months.options.organisation_or_church_letter':
		'Cartas de una organización, iglesia o trabajador/a social',
	'steps.evidence_recent_months.options.bank_or_money_transfer':
		'Registros bancarios o de transferencias de dinero',
	'steps.evidence_recent_months.options.travel_or_dated_receipts': 'Viajes o recibos con fecha',
	'steps.evidence_recent_months.options.something_else_dated_named':
		'Otro documento con fecha y mi nombre',
	'steps.evidence_recent_months.options.none_yet': 'Todavía no tengo ninguno de estos',
	'steps.specialist_flags.title':
		'¿Hay algo que pueda significar que necesitas asesoría especializada antes de solicitar?',
	'steps.specialist_flags.check_answers_label': 'Algo que pueda requerir asesoría especializada',
	'steps.specialist_flags.error': 'Elige al menos una opción.',
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
	'steps.specialist_flags.options.none': 'Ninguna de estas',
	'steps.support_needs.title': '¿Qué tipo de ayuda te sería más útil?',
	'steps.support_needs.error': 'Elige al menos una opción.',
	'steps.support_needs.check_answers_label': 'Apoyo necesario',
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
	'steps.province.title': '¿En qué provincia estás?',
	'steps.province.hint': 'Esto nos ayuda a mostrarte opciones de apoyo cerca de ti.',
	'steps.province.check_answers_label': 'Provincia',
	'steps.province.error': 'Elige una provincia.',
	'steps.province.options.madrid': 'Madrid',
	'steps.province.options.barcelona': 'Barcelona',
	'steps.province.options.valencia': 'Valencia',
	'steps.province.options.sevilla': 'Sevilla',
	'steps.province.options.malaga': 'Málaga',
	'steps.province.options.alicante': 'Alicante',
	'steps.province.options.bizkaia': 'Bizkaia',
	'steps.province.options.zaragoza': 'Zaragoza',
	'steps.province.options.murcia': 'Murcia',
	'steps.province.options.other': 'Otra provincia',
	'steps.referral.title': '¿Quieres ayuda con el siguiente paso?',
	'steps.referral.body':
		'Según tu resultado, puede que quieras ayuda para reunir documentos, hablar con una persona especialista o presentar tu solicitud.',
	'steps.referral.error': 'Elige qué tipo de ayuda quieres a continuación.',
	'steps.referral.options.contact_me': 'Sí, me gustaría que alguien me contactara',
	'steps.referral.options.show_options': 'Sí, muéstrame opciones de apoyo cerca de mí',
	'steps.referral.options.no_thanks': 'No, por ahora lo guardaré',
	'steps.contact.title': '¿Cómo deberíamos contactarte?',
	'steps.contact.hint': 'Elige la forma más segura.',
	'steps.contact.error': 'Elige cómo deberíamos contactarte.',
	'steps.contact.detail_required_error': 'Ingresa el dato de contacto para el método que elegiste.',
	'steps.contact.detail_label': 'Dato de contacto',
	'steps.contact.options.sms': 'SMS',
	'steps.contact.options.whatsapp': 'WhatsApp',
	'steps.contact.options.phone': 'Llamada telefónica',
	'steps.contact.options.email': 'Correo electrónico',
	'steps.contact.options.do_not_contact_yet': 'No me contacten todavía',
	'steps.contact.options.through_organisation': 'A través de la organización que me está ayudando',
	'answers.residence_start.2024_or_earlier': '2024 o antes',
	'answers.residence_start.2026': '2026',
	'answers.residence_start.not_sure': 'No estoy seguro/a',
	'answers.residence_start.2025': '2025',
	'answers.residence_start.2025_month_unknown': '2025 — mes no confirmado',
	'answers.residence_start.2025_month': '{month} de 2025',
	'answers.contact.with_value': '{method}: {value}',
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
	'result.next_step.other_route_advice':
		'Busca orientación sobre si otra vía migratoria encaja mejor con tu situación.',
	'result.next_step.try_again_later':
		'Si tu situación cambia, puedes revisar esta vía de nuevo más adelante.',
	'result.next_step.keep_residence_documents':
		'Guarda cualquier documento que muestre tu historial de residencia en España.',
	'result.next_step.speak_to_specialist':
		'Habla con una organización de apoyo especializada antes de presentar la solicitud.',
	'result.next_step.keep_papers_together':
		'Mantén juntos tus documentos de identidad y cualquier prueba fechada para la revisión.',
	'result.next_step.confirm_timeline':
		'Intenta confirmar si ya estabas en España antes del 1 de enero de 2026 y si permaneciste en España durante todo el periodo de 5 meses antes de presentar la solicitud.',
	'result.next_step.ask_for_help_if_unsure':
		'Si no estás seguro/a, usa la modalidad asistida o pide ayuda a una organización de apoyo.',
	'result.next_step.gather_before_cutoff':
		'Intenta reunir documentos con fecha que muestren que ya vivías en España antes de enero de 2026.',
	'result.next_step.gather_recent':
		'También reúne, si puedes, documentos recientes de los últimos 5 meses.',
	'result.next_step.use_official_channel':
		'Usa el canal oficial del gobierno antes del 30 de junio de 2026.',
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
		'Los requisitos oficiales más recientes, incluidos los certificados o documentos de antecedentes penales si aplican a tu caso.',
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
	'result.title.likely_in_scope': 'Probablemente dentro del alcance',
	'result.title.possible_but_needs_more_evidence':
		'Esta vía podría encajar, pero quizá necesites más documentos primero',
	'result.title.needs_specialist_review': 'Necesita revisión especializada',
	'result.title.another_route_may_fit_better': 'Probablemente esta no sea la vía adecuada para ti',
	'result.title.not_enough_information_yet':
		'Necesitamos un poco más de información antes de sugerir un siguiente paso',
	'result.lead.likely_in_scope': 'Puede que puedas usar esta vía',
	'result.lead.possible_but_needs_more_evidence':
		'Esta vía podría encajar, pero quizá necesites más documentos primero',
	'result.lead.needs_specialist_review':
		'Puede que necesites ayuda especializada antes de solicitar',
	'result.lead.not_enough_information_yet':
		'Necesitamos un poco más de información antes de sugerir un siguiente paso',
	'result.lead.another_route_may_fit_better': 'Probablemente esta no sea la vía adecuada para ti'
} satisfies Partial<Record<MessageKey, string>>
