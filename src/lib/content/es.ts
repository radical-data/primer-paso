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
	'chrome.language_switcher_label': 'Cambio de idioma',
	'pages.start.eyebrow': 'Hito 1',
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
	'pages.start.expectation.timeline': 'una idea aproximada de cuándo empezaste a vivir en España',
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
	'pages.handover.title': 'Resumen para apoyo o para tus registros',
	'pages.handover.body':
		'Puedes imprimir esta página, guardarla o compartirla con una persona de apoyo de confianza o una entidad colaboradora.',
	'pages.handover.reference': 'Número de referencia: {sessionId}',
	'pages.handover.generated_at': 'Generado: {generatedAt}',
	'pages.handover.next_step_title': 'Siguiente paso recomendado',
	'pages.handover.checklist_title': 'Lista de preparación',
	'pages.handover.answers_title': 'Respuestas dadas',
	'pages.handover.flags_title': 'Alertas detectadas',
	'pages.handover.action.print': 'Imprimir este resumen',
	'pages.handover.action.back_to_result': 'Volver al resultado',
	'pages.result.eyebrow': 'Resultado',
	'pages.result.eligibility_title': 'Elegibilidad probable',
	'pages.result.eligibility.likely_in_scope':
		'Según tus respuestas, podrías ser elegible para esta vía de regularización.',
	'pages.result.eligibility.possible_but_needs_more_evidence':
		'Según tus respuestas, esta vía podría encajar, pero quizá necesites más pruebas antes de solicitar.',
	'pages.result.eligibility.needs_specialist_review':
		'Según tus respuestas, esta vía podría seguir encajando, pero conviene revisarla con apoyo antes de solicitar.',
	'pages.result.eligibility.not_enough_information_yet':
		'Aún no está claro si esta vía encaja, porque falta información importante o sigue siendo incierta.',
	'pages.result.eligibility.another_route_may_fit_better':
		'Según tus respuestas, esta vía de regularización quizá no sea la más adecuada.',
	'pages.result.next_step_title': 'Tu siguiente paso',
	'pages.result.next_step.official_portal':
		'Usa el portal oficial de regularización cuando estés preparado/a.',
	'pages.result.next_step.collaborating_organisation':
		'Lleva este resumen a una entidad colaboradora antes de continuar.',
	'pages.result.next_step.collaborating_organisation_hint':
		'Usa la lista oficial para encontrar una entidad colaboradora que pueda ayudarte a revisar tu caso y los siguientes pasos.',
	'pages.result.why_title': 'Por qué te mostramos esto',
	'pages.result.checklist_title': 'Lista de preparación',
	'pages.result.checklist.already_have': 'Parece que ya tienes',
	'pages.result.checklist.still_need': 'Puede que aún necesites',
	'pages.result.checklist.discuss_with_support': 'Puede ayudar hablarlo con apoyo sobre',
	'pages.result.checklist.unresolved': 'Preguntas que siguen sin aclararse',
	'pages.result.route.official_portal_body':
		'Usa el portal oficial del gobierno para el proceso de regularización. Si primero necesitas ayuda, también puedes llevar este resumen a una entidad colaboradora.',
	'pages.result.route.collaborating_organisation_body':
		'Empieza por la lista oficial de entidades colaboradoras. Lleva este resumen para que no tengan que empezar de cero.',
	'pages.result.handover_title': 'Resumen y registros',
	'pages.result.handover.body':
		'Imprime o guarda un resumen de entrega para conservar una copia de tus respuestas o compartirlas con una persona de apoyo de confianza.',
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
	'pages.result.action.print_handover': 'Imprimir o guardar resumen de entrega',
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
	'eyebrows.route_split': 'Tu situación',
	'eyebrows.route_asylum': 'Tus documentos',
	'eyebrows.route_non_asylum': 'Tu situación',
	'eyebrows.identity': 'Tus documentos',
	'eyebrows.evidence_cutoff': 'Pruebas de residencia',
	'eyebrows.evidence_recent': 'Pruebas de residencia',
	'eyebrows.specialist': 'Necesidades de apoyo adicionales',
	'eyebrows.routing': 'Apoyo local',
	'eyebrows.referral': 'Apoyo local',
	'eyebrows.support': 'Necesidades de apoyo adicionales',
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
	'steps.in_spain_now.title': '¿Estás en España ahora?',
	'steps.in_spain_now.check_answers_label': 'Si estás en España ahora',
	'steps.in_spain_now.error': 'Elige si estás en España ahora.',
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
	'steps.five_month_stay.title': '¿Has estado viviendo en España durante los últimos 5 meses?',
	'steps.five_month_stay.body': '¿Has estado en España durante los últimos 5 meses?',
	'steps.five_month_stay.hint': 'Las salidas cortas no siempre importan.',
	'steps.five_month_stay.check_answers_label':
		'Si has estado en España durante los últimos 5 meses',
	'steps.five_month_stay.error': 'Elige si has estado en España durante los últimos 5 meses.',
	'steps.five_month_stay.options.mostly_yes': 'Casi siempre sí, con ausencias cortas',
	'steps.asylum_documents.title': '¿Tienes algún documento sobre tu caso de asilo o protección?',
	'steps.asylum_documents.hint':
		'Por ejemplo, un resguardo de presentación, documento del caso, carta o notificación.',
	'steps.asylum_documents.check_answers_label': 'Documentos sobre tu caso de asilo o protección',
	'steps.asylum_documents.error': 'Elige si tienes documentos sobre tu caso de asilo o protección.',
	'steps.non_asylum_route.title': '¿Cuál de estas opciones se parece más a tu situación?',
	'steps.non_asylum_route.check_answers_label': 'Qué opciones se parecen a tu situación',
	'steps.non_asylum_route.error': 'Elige al menos una opción.',
	'steps.non_asylum_route.options.worked_in_spain': 'He trabajado en España',
	'steps.non_asylum_route.options.close_family_relevant':
		'Tengo familiares cercanos aquí que podrían ser relevantes para este proceso',
	'steps.non_asylum_route.options.vulnerable_situation':
		'Podría necesitar apoyo por una situación difícil o de vulnerabilidad',
	'steps.non_asylum_route.options.none': 'Ninguna de estas',
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
		'Ayuda para usar un teléfono o computador',
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
	'answers.residence_start.2025_month_unknown': '2025 — mes no seguro',
	'answers.residence_start.2025_month': '{month} de 2025',
	'answers.contact.with_value': '{method}: {value}',
	'result.reason.not_in_spain_now': 'Dijiste que ahora no estás en España.',
	'result.reason.after_cutoff': 'Dijiste que empezaste a vivir en España en 2026.',
	'result.reason.specialist_review':
		'Algunas de tus respuestas sugieren que podrías necesitar ayuda antes de solicitar.',
	'result.reason.specialist_review_criminal_record':
		'Dijiste que podrías tener una preocupación por antecedentes penales; sería más seguro revisarlo con apoyo antes de solicitar.',
	'result.reason.specialist_review_identity':
		'Dijiste que podrían faltar datos de identidad o no coincidir; sería más seguro revisarlo con apoyo antes de solicitar.',
	'result.reason.not_enough_information':
		'Algunas de las respuestas clave sobre fechas siguen siendo inciertas.',
	'result.reason.more_evidence':
		'Tu vía y tus fechas podrían encajar, pero por ahora las pruebas parecen insuficientes.',
	'result.reason.likely_in_scope':
		'Tus respuestas encajan en términos generales con la vía, las fechas y el patrón de pruebas de este cuestionario.',
	'result.explanation.not_in_spain_now':
		'Según tus respuestas, probablemente esta no sea la vía adecuada para ti en este momento.',
	'result.explanation.after_cutoff':
		'Según tus respuestas, probablemente esta vía no sea la mejor opción para tu caso.',
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
		'Intenta confirmar aproximadamente cuándo empezaste a vivir en España y si has estado viviendo aquí durante los últimos 5 meses.',
	'result.next_step.ask_for_help_if_unsure':
		'Si no estás seguro/a, usa la modalidad asistida o pide ayuda a una organización de apoyo.',
	'result.next_step.gather_before_cutoff':
		'Intenta reunir documentos con fecha que muestren que ya vivías en España antes de enero de 2026.',
	'result.next_step.gather_recent':
		'También reúne, si puedes, documentos recientes de los últimos 5 meses.',
	'result.next_step.use_official_channel':
		'Usa el canal oficial del gobierno antes del 30 de junio de 2026.',
	'result.flag.not_in_spain_now': 'No estás en España ahora',
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
		'Ya identificaste al menos un documento de identidad.',
	'result.checklist.item.asylum_case_documents_available':
		'Ya identificaste documentos sobre tu caso de asilo o protección.',
	'result.checklist.item.before_cutoff_evidence_available':
		'Ya identificaste documentos que pueden ayudar a mostrar residencia en España antes de enero de 2026.',
	'result.checklist.item.recent_evidence_available':
		'Ya identificaste documentos de los últimos 5 meses.',
	'result.checklist.item.continuity_answer_positive':
		'Respondiste que has vivido en España durante los últimos 5 meses, o en su mayor parte.',
	'result.checklist.item.identity_document_needed':
		'Comprueba qué documento de identidad puedes usar y tenlo listo para revisión.',
	'result.checklist.item.before_cutoff_evidence_needed':
		'Intenta reunir documentos fechados que muestren que vivías en España antes de enero de 2026.',
	'result.checklist.item.recent_evidence_needed':
		'Intenta reunir documentos de los últimos 5 meses que muestren que has vivido en España recientemente.',
	'result.checklist.item.asylum_case_documents_needed':
		'Si tu historial de asilo o protección importa aquí, reúne cualquier documento del expediente, recibos, cartas o notificaciones que aún tengas.',
	'result.checklist.item.official_document_requirements':
		'Consulta el portal oficial para los requisitos documentales más recientes, incluidos los antecedentes penales cuando proceda.',
	'result.checklist.item.practical_support_helpful':
		'El apoyo puede ayudar con idioma, acceso digital, escaneo, impresión o a entender qué documentos importan más.',
	'result.checklist.item.complex_case_review':
		'Cualquier preocupación sobre documentos, pruebas, historial de asilo o seguridad en línea.',
	'result.checklist.item.another_route_advice':
		'Una entidad colaboradora puede ayudarte a entender si otra vía de inmigración encaja mejor con tu situación.',
	'result.checklist.item.confirm_timeline':
		'Intenta confirmar aproximadamente cuándo empezaste a vivir en España y si has estado aquí durante los últimos 5 meses.',
	'result.checklist.item.continuity_concern':
		'Prepárate para explicar lagunas o ausencias durante los últimos 5 meses.',
	'result.checklist.item.identity_issue_to_explain':
		'Prepárate para explicar documentos de identidad faltantes o datos personales que no coinciden.',
	'result.checklist.item.asylum_history_to_explain':
		'Prepárate para explicar qué ocurrió con cualquier proceso de asilo o protección en España.',
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
