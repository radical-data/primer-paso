import type { MessageKey } from './index'

export const fr = {
	'common.not_answered': 'Sans réponse',
	'common.choose_an_option': 'Choisissez une option',
	'common.choose_month': 'Choisissez un mois',
	'common.choose_one_answer': 'Choisissez une réponse',
	'common.choose_all_that_apply': 'Cochez toutes les réponses qui s’appliquent',
	'common.continue': 'Continuer',
	'common.back': 'Retour',
	'common.problem': 'Il y a un problème',
	'chrome.app_title': 'Primer Paso',
	'chrome.meta_description':
		'Primer Paso est un questionnaire d’accueil pour la procédure extraordinaire de régularisation en Espagne en 2026. Hébergé sur primerpaso.org.',
	'chrome.brand': 'Primer Paso',
	'chrome.language_switcher_label': 'Sélecteur de langue',
	'pages.start.eyebrow': 'Étape 1',
	'pages.start.title':
		'Vérifiez de quel accompagnement vous pourriez avoir besoin pour la procédure de régularisation',
	'pages.start.lead':
		'Utilisez ce questionnaire pour comprendre quelle pourrait être votre prochaine étape.',
	'pages.start.not_official': 'Ceci n’est pas la demande officielle du gouvernement.',
	'pages.start.window_open':
		'La période officielle de dépôt des demandes est ouverte jusqu’au 30 juin 2026.',
	'pages.start.resume': 'Vous pouvez arrêter et revenir plus tard.',
	'pages.start.what_to_expect_title': 'À quoi vous attendre',
	'pages.start.expectation.duration': 'environ 5 à 8 minutes',
	'pages.start.expectation.one_question': 'une question à la fois',
	'pages.start.expectation.review': 'une étape de vérification avant le résultat',
	'pages.start.expectation.timeline':
		'si vous étiez déjà en Espagne avant le 1er janvier 2026 et si vous y êtes resté·e pendant toute la période de 5 mois avant de déposer votre demande',
	'pages.start.start_now': 'Commencer le questionnaire',
	'pages.check_answers.eyebrow': 'Vérification',
	'pages.check_answers.title': 'Vérifiez vos réponses',
	'pages.check_answers.hint':
		'Vérifiez ces réponses avant de continuer. Vous pouvez modifier n’importe quelle réponse.',
	'pages.check_answers.change': 'Modifier',
	'pages.check_answers.see_result': 'Voir le résultat',
	'pages.check_answers.back': 'Retour',
	'pages.handover.eyebrow': 'Transmission',
	'pages.handover.summary_title': 'Résumé',
	'pages.handover.title': 'Résumé à enregistrer, imprimer ou partager',
	'pages.handover.body':
		'Utilisez ce résumé pour garder une copie de vos réponses ou pour le partager avec une personne de confiance ou une organisation partenaire.',
	'pages.handover.reference': 'Numéro de référence : {sessionId}',
	'pages.handover.generated_at': 'Généré le : {generatedAt}',
	'pages.handover.next_step_title': 'Prochaine étape recommandée',
	'pages.handover.checklist_title': 'Ce qu’il faut préparer',
	'pages.handover.answers_title': 'Vos réponses',
	'pages.handover.flags_title': 'Points pouvant demander une attention',
	'pages.handover.action.print': 'Imprimer ce résumé',
	'pages.handover.action.back_to_result': 'Retour au résultat',
	'pages.result.eyebrow': 'Résultat',
	'pages.result.eligibility_title': 'Éligibilité probable',
	'pages.result.eligibility.likely_in_scope':
		'D’après vos réponses, cette voie de régularisation pourrait correspondre à votre situation.',
	'pages.result.eligibility.possible_but_needs_more_evidence':
		'D’après vos réponses, cette voie pourrait convenir, mais il vous faudra peut-être davantage de documents avant de déposer une demande.',
	'pages.result.eligibility.needs_specialist_review':
		'D’après vos réponses, cette voie pourrait encore convenir, mais il serait plus prudent de la revoir avec un accompagnement avant de déposer une demande.',
	'pages.result.eligibility.not_enough_information_yet':
		'On ne sait pas encore si cette voie convient, car des informations importantes manquent ou restent incertaines.',
	'pages.result.eligibility.another_route_may_fit_better':
		'D’après vos réponses, une autre voie d’immigration pourrait mieux convenir.',
	'pages.result.next_step_title': 'Votre prochaine étape',
	'pages.result.next_step.official_portal':
		'Allez sur le portail officiel de régularisation quand vous êtes prêt·e à continuer.',
	'pages.result.next_step.collaborating_organisation':
		'Apportez ce résumé à une organisation partenaire avant de continuer.',
	'pages.result.next_step.collaborating_organisation_hint':
		'Ouvrez la liste officielle et choisissez une organisation partenaire qui pourra examiner votre dossier avec vous.',
	'pages.result.why_title': 'Pourquoi nous pensons cela',
	'pages.result.checklist_title': 'Ce qu’il faut préparer',
	'pages.result.checklist.already_have': 'Ce que vous avez déjà',
	'pages.result.checklist.still_need': 'Ce qui peut encore manquer',
	'pages.result.checklist.discuss_with_support':
		'Ce qu’il vaut mieux demander quand vous obtenez de l’aide',
	'pages.result.checklist.unresolved': 'Ce qu’il faut vérifier ou expliquer',
	'pages.result.route.official_portal_body':
		'Utilisez le portail officiel du gouvernement pour la procédure de régularisation. Si vous avez d’abord besoin d’aide, vous pouvez aussi apporter ce résumé à une organisation partenaire.',
	'pages.result.route.collaborating_organisation_body':
		'Commencez par la liste officielle des organisations partenaires. Apportez ce résumé pour éviter de tout recommencer depuis le début.',
	'pages.result.handover_title': 'Enregistrer, imprimer ou partager votre résumé',
	'pages.result.handover.body':
		'Gardez une copie de vos réponses. Vous pouvez aussi apporter ce résumé à une personne de confiance ou à une organisation partenaire.',
	'pages.result.how_to_apply_title': 'Avant de faire une demande',
	'pages.result.how_to_apply.body':
		'N’attendez pas le dernier moment et utilisez le canal officiel du gouvernement pour déposer votre demande.',
	'pages.result.how_to_apply.hint':
		'La période officielle de dépôt des demandes est ouverte jusqu’au 30 juin 2026.',
	'pages.result.support_title': 'Obtenir de l’aide',
	'pages.result.support.body':
		'Ce questionnaire ne constitue pas un conseil juridique. L’aide disponible près de chez vous peut dépendre de votre province : {province}.',
	'pages.result.flags_title': 'Points signalés',
	'pages.result.reference_title': 'Conservez cette référence',
	'pages.result.reference_body': 'Numéro de référence : {sessionId}',
	'pages.result.action.official_portal': 'Utiliser le portail officiel de régularisation',
	'pages.result.action.open_official_portal': 'Ouvrir le portail officiel de régularisation',
	'pages.result.action.open_collaborators_pdf':
		'Ouvrir la liste officielle des organisations partenaires',
	'pages.result.action.collaborators_pdf': 'Voir la liste officielle des organisations partenaires',
	'pages.result.action.print_handover': 'Imprimer ou enregistrer le résumé de transmission',
	'pages.result.action.download_handover_json': 'Télécharger le JSON du résumé',
	'pages.result.action.back_to_answers': 'Retour aux réponses',
	'pages.result.action.start_again': 'Recommencer',
	'pages.confirmation.eyebrow': 'Confirmation',
	'pages.confirmation.title': 'Votre résultat est prêt',
	'pages.confirmation.body':
		'Conservez cette page. Elle comprend votre numéro de référence et une copie de vos réponses.',
	'pages.confirmation.reference_number': 'Numéro de référence',
	'pages.confirmation.updated': 'Mis à jour',
	'pages.confirmation.hint': 'Enregistrez, imprimez ou faites une capture d’écran de cette page.',
	'pages.confirmation.action.view_answers': 'Voir vos réponses',
	'pages.confirmation.action.back_to_result': 'Retour au résultat',
	'pages.confirmation.action.start_again': 'Recommencer',
	'eyebrows.session_setup': 'Pour commencer',
	'eyebrows.eligibility': 'Éligibilité',
	'eyebrows.route_split': 'Éligibilité',
	'eyebrows.route_asylum': 'Documents',
	'eyebrows.route_non_asylum': 'Éligibilité',
	'eyebrows.identity': 'Documents',
	'eyebrows.documents': 'Documents',
	'eyebrows.evidence_cutoff': 'Documents',
	'eyebrows.evidence_recent': 'Documents',
	'eyebrows.specialist': 'Besoins d’accompagnement',
	'eyebrows.routing': 'Besoins d’accompagnement',
	'eyebrows.referral': 'Aide locale',
	'eyebrows.support': 'Besoins d’accompagnement',
	'eyebrows.contact': 'Comment nous pouvons vous contacter',
	'months.january': 'Janvier',
	'months.february': 'Février',
	'months.march': 'Mars',
	'months.april': 'Avril',
	'months.may': 'Mai',
	'months.june': 'Juin',
	'months.july': 'Juillet',
	'months.august': 'Août',
	'months.september': 'Septembre',
	'months.october': 'Octobre',
	'months.november': 'Novembre',
	'months.december': 'Décembre',
	'steps.language.title': 'Choisissez une langue',
	'steps.language.hint': 'Vous pouvez changer de langue à tout moment sans perdre vos réponses.',
	'steps.language.check_answers_label': 'Langue',
	'steps.language.error': 'Choisissez une langue.',
	'steps.language.options.es': 'Español',
	'steps.language.options.en': 'English',
	'steps.language.options.ar': 'العربية',
	'steps.language.options.fr': 'Français',
	'steps.completion_mode.title': 'Pour qui remplissez-vous ce questionnaire ?',
	'steps.completion_mode.hint': 'Choisissez l’option qui correspond le mieux à cette session.',
	'steps.completion_mode.check_answers_label':
		'Personne pour laquelle vous remplissez ce questionnaire',
	'steps.completion_mode.error': 'Choisissez pour qui vous remplissez ce questionnaire.',
	'steps.completion_mode.options.self': 'Pour moi',
	'steps.completion_mode.options.someone_else': 'Pour une autre personne, avec son autorisation',
	'steps.completion_mode.options.support_worker': 'Je suis travailleur·euse social·e ou bénévole',
	'steps.presence_before_cutoff.title':
		'Viviez-vous déjà en Espagne avant le 1er janvier 2026 ?',
	'steps.presence_before_cutoff.hint':
		'Répondez en fonction du fait que vous viviez déjà en Espagne avant la date limite',
	'steps.presence_before_cutoff.check_answers_label':
		'Résidence en Espagne avant le 1er janvier 2026',
	'steps.presence_before_cutoff.error':
		'Choisissez si vous viviez déjà en Espagne avant le 1er janvier 2026.',
	'steps.common.options.yes': 'Oui',
	'steps.common.options.no': 'Non',
	'steps.common.options.not_sure': 'Je ne suis pas sûr·e',
	'steps.residence_start.title': 'Quand avez-vous commencé à vivre en Espagne ?',
	'steps.residence_start.hint': 'Un mois approximatif suffit.',
	'steps.residence_start.check_answers_label':
		'Date à laquelle vous avez commencé à vivre en Espagne',
	'steps.residence_start.error': 'Choisissez quand vous avez commencé à vivre en Espagne.',
	'steps.residence_start.month_error':
		'Choisissez le mois ou indiquez que vous n’êtes pas sûr·e du mois.',
	'steps.residence_start.options.2024_or_earlier': 'En 2024 ou avant',
	'steps.residence_start.options.2025': 'En 2025',
	'steps.residence_start.options.2026': 'En 2026',
	'steps.residence_start.options.not_sure': 'Je ne suis pas sûr·e',
	'steps.residence_start.month_prompt': 'Quel mois était-ce, approximativement ?',
	'steps.residence_start.month_unknown': 'Je ne suis pas sûr·e du mois',
	'steps.asylum_history.title':
		'Avez-vous demandé l’asile ou une protection internationale en Espagne ?',
	'steps.asylum_history.check_answers_label': 'Asile ou protection internationale en Espagne',
	'steps.asylum_history.error':
		'Choisissez si vous avez demandé l’asile ou une protection internationale en Espagne.',
	'steps.asylum_before_cutoff.title':
		'Cette demande a-t-elle été déposée avant le 1er janvier 2026 ?',
	'steps.asylum_before_cutoff.check_answers_label':
		'Asile ou protection internationale avant le 1er janvier 2026',
	'steps.asylum_before_cutoff.error':
		'Choisissez si cette demande a été déposée avant le 1er janvier 2026.',
	'steps.five_month_stay.title':
		'Dans les 5 mois précédant la date à laquelle vous prévoyez de déposer votre demande, avez-vous été en Espagne en permanence ?',
	'steps.five_month_stay.body':
		'Répondez en pensant aux 5 mois précédant la date à laquelle vous prévoyez de déposer votre demande.',
	'steps.five_month_stay.check_answers_label':
		'Présence continue en Espagne pendant toute la période de 5 mois',
	'steps.five_month_stay.error': 'Choisissez la réponse qui correspond le mieux à votre situation.',
	'steps.five_month_stay.options.left_spain': 'Non, j’ai quitté l’Espagne à un moment donné',
	'steps.asylum_documents.title':
		'Avez-vous des documents concernant votre dossier d’asile ou de protection ?',
	'steps.asylum_documents.hint':
		'Par exemple, un récépissé de dépôt, un document du dossier, une lettre ou une notification.',
	'steps.asylum_documents.check_answers_label':
		'Documents concernant votre dossier d’asile ou de protection',
	'steps.asylum_documents.error':
		'Choisissez si vous avez des documents concernant votre dossier d’asile ou de protection.',
	'steps.work_situation.title': 'L’un de ces éléments décrit-il votre situation professionnelle ?',
	'steps.work_situation.check_answers_label': 'Situation professionnelle',
	'steps.work_situation.error': 'Choisissez au moins une option.',
	'steps.work_situation.options.worked_in_spain': 'J’ai travaillé en Espagne',
	'steps.work_situation.options.job_offer': 'J’ai une offre d’emploi',
	'steps.work_situation.options.want_to_work_for_myself': 'Je veux travailler à mon compte',
	'steps.work_situation.options.none': 'Aucune de ces réponses',
	'steps.family_situation.title':
		'L’un de ces éléments décrit-il votre situation familiale en Espagne ?',
	'steps.family_situation.check_answers_label': 'Situation familiale en Espagne',
	'steps.family_situation.error': 'Choisissez au moins une option.',
	'steps.family_situation.options.child_under_18':
		'Je vis avec mon enfant de moins de 18 ans',
	'steps.family_situation.options.adult_child_support_needs':
		'Je vis avec mon enfant adulte qui a besoin de beaucoup d’aide en raison d’un handicap ou de problèmes de santé',
	'steps.family_situation.options.mother_or_father': 'Je vis avec ma mère ou mon père',
	'steps.family_situation.options.none': 'Aucune de ces réponses',
	'steps.identity_documents.title': 'Quels documents d’identité avez-vous ?',
	'steps.identity_documents.check_answers_label': 'Documents d’identité',
	'steps.identity_documents.error': 'Choisissez au moins une option.',
	'steps.identity_documents.options.current_passport': 'Passeport en cours de validité',
	'steps.identity_documents.options.expired_passport': 'Passeport expiré',
	'steps.identity_documents.options.national_identity_card': 'Carte nationale d’identité',
	'steps.identity_documents.options.asylum_document': 'Document d’asile',
	'steps.identity_documents.options.travel_document': 'Titre de voyage',
	'steps.identity_documents.options.no_identity_documents_now':
		'Je n’ai pas de document d’identité avec moi en ce moment',
	'steps.identity_documents.options.prefer_not_to_say': 'Je préfère ne pas le dire',
	'steps.evidence_before_cutoff.title':
		'Avez-vous des documents pouvant aider à montrer que vous viviez déjà en Espagne avant janvier 2026 ?',
	'steps.evidence_before_cutoff.check_answers_label':
		'Documents pouvant montrer une résidence avant janvier 2026',
	'steps.evidence_before_cutoff.error': 'Choisissez au moins une option.',
	'steps.evidence_before_cutoff.options.padron_or_registration':
		'Empadronamiento ou enregistrement',
	'steps.evidence_before_cutoff.options.housing_papers': 'Documents de logement',
	'steps.evidence_before_cutoff.options.health_or_pharmacy': 'Documents de santé ou de pharmacie',
	'steps.evidence_before_cutoff.options.school_or_childcare':
		'Documents scolaires ou de garde d’enfants',
	'steps.evidence_before_cutoff.options.work_papers': 'Documents de travail',
	'steps.evidence_before_cutoff.options.organisation_or_church_letter':
		'Lettres d’une organisation, d’une église ou d’un travailleur social',
	'steps.evidence_before_cutoff.options.travel_or_transport': 'Documents de voyage ou de transport',
	'steps.evidence_before_cutoff.options.something_else_dated_named':
		'Un autre document portant une date et mon nom',
	'steps.evidence_before_cutoff.options.none_yet': 'Je n’ai encore aucun de ces documents',
	'steps.evidence_recent_months.title':
		'Avez-vous des documents des 5 derniers mois pouvant aider à montrer que vous vivez ici récemment ?',
	'steps.evidence_recent_months.check_answers_label': 'Documents des 5 derniers mois',
	'steps.evidence_recent_months.error': 'Choisissez au moins une option.',
	'steps.evidence_recent_months.options.housing_papers': 'Documents de logement',
	'steps.evidence_recent_months.options.health_or_pharmacy': 'Documents de santé ou de pharmacie',
	'steps.evidence_recent_months.options.school_or_childcare':
		'Documents scolaires ou de garde d’enfants',
	'steps.evidence_recent_months.options.work_papers': 'Documents de travail',
	'steps.evidence_recent_months.options.organisation_or_church_letter':
		'Lettres d’une organisation, d’une église ou d’un travailleur social',
	'steps.evidence_recent_months.options.bank_or_money_transfer':
		'Relevés bancaires ou transferts d’argent',
	'steps.evidence_recent_months.options.travel_or_dated_receipts': 'Voyages ou reçus datés',
	'steps.evidence_recent_months.options.something_else_dated_named':
		'Un autre document portant une date et mon nom',
	'steps.evidence_recent_months.options.none_yet': 'Je n’ai encore aucun de ces documents',
	'steps.specialist_flags.title':
		'Y a-t-il quelque chose qui pourrait signifier que vous avez besoin d’un avis spécialisé avant de faire votre demande ?',
	'steps.specialist_flags.check_answers_label': 'Éléments pouvant nécessiter un avis spécialisé',
	'steps.specialist_flags.error': 'Choisissez au moins une option.',
	'steps.specialist_flags.options.criminal_record_worry':
		'Je crains d’avoir un casier judiciaire ou une affaire pénale',
	'steps.specialist_flags.options.identity_missing_or_mismatch':
		'Mes documents d’identité manquent ou mes informations ne correspondent pas d’un document à l’autre',
	'steps.specialist_flags.options.previous_refusal_needs_help':
		'J’ai reçu un refus dans une autre procédure et j’ai besoin d’aide pour le comprendre',
	'steps.specialist_flags.options.asylum_case_not_clear':
		'Je ne sais pas clairement ce qu’il s’est passé avec mon dossier d’asile',
	'steps.specialist_flags.options.unsafe_sharing_digitally':
		'Je ne me sens pas en sécurité pour partager certaines informations en ligne',
	'steps.specialist_flags.options.urgent_human_support': 'J’ai besoin d’une aide humaine urgente',
	'steps.specialist_flags.options.want_specialist':
		'Je préfère parler de cela avec une personne spécialisée',
	'steps.specialist_flags.options.none': 'Aucune de ces réponses',
	'steps.support_needs.title': 'Quel type d’aide vous serait le plus utile ?',
	'steps.support_needs.error': 'Choisissez au moins une option.',
	'steps.support_needs.check_answers_label': 'Aide nécessaire',
	'steps.support_needs.options.another_language': 'Aide dans une autre langue',
	'steps.support_needs.options.in_person_help': 'Aide en présentiel',
	'steps.support_needs.options.phone_support': 'Aide par téléphone',
	'steps.support_needs.options.help_using_phone_or_computer':
		'Aide pour utiliser un téléphone ou un ordinateur',
	'steps.support_needs.options.help_scanning_or_printing':
		'Aide pour numériser ou imprimer des documents',
	'steps.support_needs.options.help_gathering_papers':
		'Aide pour comprendre quels documents rassembler',
	'steps.support_needs.options.child_or_dependant_support':
		'Aide également pour des enfants ou des personnes à charge',
	'steps.support_needs.options.specialist_advice': 'Avis spécialisé',
	'steps.province.title': 'Dans quelle province êtes-vous ?',
	'steps.province.hint': 'Cela nous aide à vous montrer des options d’aide près de chez vous.',
	'steps.province.check_answers_label': 'Province',
	'steps.province.error': 'Choisissez une province.',
	'steps.province.options.madrid': 'Madrid',
	'steps.province.options.barcelona': 'Barcelona',
	'steps.province.options.valencia': 'Valencia',
	'steps.province.options.sevilla': 'Sevilla',
	'steps.province.options.malaga': 'Málaga',
	'steps.province.options.alicante': 'Alicante',
	'steps.province.options.bizkaia': 'Bizkaia',
	'steps.province.options.zaragoza': 'Zaragoza',
	'steps.province.options.murcia': 'Murcia',
	'steps.province.options.other': 'Une autre province',
	'steps.referral.title': 'Voulez-vous de l’aide pour la prochaine étape ?',
	'steps.referral.body':
		'Selon votre résultat, vous pourriez vouloir de l’aide pour rassembler des documents, parler à une personne spécialisée ou déposer votre demande.',
	'steps.referral.error': 'Choisissez le type d’aide que vous souhaitez ensuite.',
	'steps.referral.options.contact_me': 'Oui, je voudrais que quelqu’un me contacte',
	'steps.referral.options.show_options': 'Oui, montrez-moi des options d’aide près de chez moi',
	'steps.referral.options.no_thanks': 'Non, je vais conserver cela pour l’instant',
	'steps.contact.title': 'Comment devons-nous vous contacter ?',
	'steps.contact.hint': 'Choisissez le moyen le plus sûr.',
	'steps.contact.error': 'Choisissez comment nous devons vous contacter.',
	'steps.contact.detail_required_error':
		'Indiquez la coordonnée correspondant au mode de contact choisi.',
	'steps.contact.detail_label': 'Coordonnée',
	'steps.contact.options.sms': 'SMS',
	'steps.contact.options.whatsapp': 'WhatsApp',
	'steps.contact.options.phone': 'Appel téléphonique',
	'steps.contact.options.email': 'E-mail',
	'steps.contact.options.do_not_contact_yet': 'Ne me contactez pas pour le moment',
	'steps.contact.options.through_organisation':
		'Par l’intermédiaire de l’organisation qui m’aide actuellement',
	'answers.residence_start.2024_or_earlier': '2024 ou avant',
	'answers.residence_start.2026': '2026',
	'answers.residence_start.not_sure': 'Je ne suis pas sûr·e',
	'answers.residence_start.2025': '2025',
	'answers.residence_start.2025_month_unknown': '2025 — mois inconnu',
	'answers.residence_start.2025_month': '{month} 2025',
	'answers.contact.with_value': '{method} : {value}',
	'result.reason.after_cutoff':
		'Vous avez indiqué que vous ne viviez pas encore en Espagne avant le 1er janvier 2026.',
	'result.reason.specialist_review':
		'Une ou plusieurs de vos réponses suggèrent qu’il serait plus prudent d’obtenir de l’aide avant de déposer une demande.',
	'result.reason.specialist_review_criminal_record':
		'Vous avez indiqué une inquiétude liée au casier judiciaire. Il est plus prudent d’en parler avec un accompagnement avant de déposer une demande.',
	'result.reason.specialist_review_identity':
		'Vous avez indiqué des pièces d’identité manquantes ou des informations incohérentes. Il est plus prudent d’en parler avec un accompagnement avant de déposer une demande.',
	'result.reason.not_enough_information':
		'Des éléments importants sur votre situation ou votre chronologie restent encore flous.',
	'result.reason.more_evidence':
		'Vos réponses pourraient correspondre à cette voie, mais il vous faudra peut-être davantage de documents pour appuyer votre demande.',
	'result.reason.likely_in_scope':
		'Vos réponses suggèrent que vos dates et vos documents pourraient correspondre à cette voie.',
	'result.explanation.after_cutoff':
		'D’après vos réponses, cette voie n’est probablement pas la plus adaptée, car la date limite risque de ne pas être respectée.',
	'result.explanation.specialist_review':
		'Vos réponses suggèrent qu’une personne spécialisée devrait examiner votre situation avant la prochaine étape.',
	'result.explanation.not_enough_information':
		'Il n’y a pas encore assez d’informations pour suggérer la meilleure prochaine étape.',
	'result.explanation.more_evidence':
		'D’après vos réponses, cette voie pourrait correspondre à votre situation, mais il vous faudra peut-être davantage de documents avant de déposer votre demande.',
	'result.explanation.likely_in_scope':
		'Vos réponses suggèrent que vous pourriez pouvoir utiliser cette procédure de régularisation.',
	'result.next_step.other_route_advice':
		'Demandez conseil pour savoir si une autre voie migratoire conviendrait mieux à votre situation.',
	'result.next_step.try_again_later':
		'Si votre situation change, vous pourrez vérifier cette voie de nouveau plus tard.',
	'result.next_step.keep_residence_documents':
		'Conservez tous les documents montrant votre historique de résidence en Espagne.',
	'result.next_step.speak_to_specialist':
		'Parlez à une organisation d’accompagnement spécialisée avant de déposer votre demande.',
	'result.next_step.keep_papers_together':
		'Gardez ensemble vos pièces d’identité et toutes les preuves datées pour qu’elles puissent être examinées.',
	'result.next_step.confirm_timeline':
		'Essayez de confirmer si vous étiez déjà en Espagne avant le 1er janvier 2026 et si vous y êtes resté·e pendant toute la période de 5 mois avant de déposer votre demande.',
	'result.next_step.ask_for_help_if_unsure':
		'Si vous n’êtes pas sûr·e, utilisez le mode accompagné ou demandez de l’aide à une organisation de soutien.',
	'result.next_step.gather_before_cutoff':
		'Essayez de rassembler des documents datés montrant que vous viviez en Espagne avant janvier 2026.',
	'result.next_step.gather_recent':
		'Rassemblez aussi, si possible, des documents récents des 5 derniers mois.',
	'result.next_step.use_official_channel':
		'Utilisez le canal officiel de dépôt des demandes avant le 30 juin 2026.',
	'result.flag.uncertain_timeline': 'La chronologie est incertaine',
	'result.flag.five_month_requirement_risk': 'Risque possible concernant la continuité',
	'result.flag.hard_gate_after_cutoff': 'Le début de résidence est postérieur à la date limite',
	'result.flag.criminal_record_concern': 'Préoccupation possible liée au casier judiciaire',
	'result.flag.identity_issue': 'Problème d’identité',
	'result.flag.asylum_complexity': 'Complexité possible liée à l’asile',
	'result.flag.missing_identity_documents': 'Documents d’identité manquants',
	'result.flag.continuity_concern': 'Préoccupation concernant la continuité',
	'result.flag.family_support_needs':
		'Besoins d’accompagnement pour la famille ou les personnes à charge',
	'result.checklist.item.identity_document_available':
		'Une pièce d’identité que vous pouvez montrer.',
	'result.checklist.item.asylum_case_documents_available':
		'Des documents concernant votre dossier d’asile ou de protection.',
	'result.checklist.item.before_cutoff_evidence_available':
		'Des documents pouvant montrer que vous étiez en Espagne avant janvier 2026.',
	'result.checklist.item.recent_evidence_available': 'Des documents récents des 5 derniers mois.',
	'result.checklist.item.continuity_answer_positive':
		'Un séjour récent en Espagne qui pourrait correspondre à cette voie.',
	'result.checklist.item.identity_document_needed':
		'Une pièce d’identité que vous pouvez utiliser pour la demande.',
	'result.checklist.item.before_cutoff_evidence_needed':
		'Des documents datés montrant que vous étiez en Espagne avant janvier 2026.',
	'result.checklist.item.recent_evidence_needed': 'Des documents récents des 5 derniers mois.',
	'result.checklist.item.asylum_case_documents_needed':
		'Tout document que vous avez encore sur une procédure d’asile ou de protection, si cela concerne votre situation.',
	'result.checklist.item.official_document_requirements':
		'Les exigences officielles les plus récentes, y compris les documents de casier judiciaire si elles s’appliquent à votre situation.',
	'result.checklist.item.practical_support_helpful':
		'De l’aide pour la langue, l’accès numérique, le scan, l’impression ou pour comprendre quels documents comptent.',
	'result.checklist.item.complex_case_review':
		'Toute inquiétude concernant le casier judiciaire, l’identité, l’historique d’asile ou le partage d’informations en sécurité.',
	'result.checklist.item.another_route_advice':
		'La question de savoir si une autre voie d’immigration pourrait mieux convenir.',
	'result.checklist.item.confirm_timeline':
		'Si vous étiez déjà en Espagne avant le 1er janvier 2026 et si vous y êtes resté·e pendant toute la période de 5 mois avant de déposer votre demande.',
	'result.checklist.item.continuity_concern':
		'Toute interruption ou absence pendant les 5 derniers mois.',
	'result.checklist.item.identity_issue_to_explain':
		'Toute pièce d’identité manquante ou tout détail qui ne correspond pas.',
	'result.checklist.item.asylum_history_to_explain':
		'Ce qui s’est passé dans toute procédure d’asile ou de protection en Espagne.',
	'result.title.likely_in_scope': 'Probablement concerné·e',
	'result.title.possible_but_needs_more_evidence':
		'Cette voie pourrait convenir, mais vous aurez peut-être besoin de davantage de documents d’abord',
	'result.title.needs_specialist_review': 'Nécessite une révision spécialisée',
	'result.title.another_route_may_fit_better':
		'Cette voie n’est probablement pas la bonne pour vous',
	'result.title.not_enough_information_yet':
		'Nous avons besoin d’un peu plus d’informations avant de suggérer une prochaine étape',
	'result.lead.likely_in_scope': 'Vous pourriez pouvoir utiliser cette voie',
	'result.lead.possible_but_needs_more_evidence':
		'Cette voie pourrait convenir, mais vous aurez peut-être besoin de davantage de documents d’abord',
	'result.lead.needs_specialist_review':
		'Vous pourriez avoir besoin d’une aide spécialisée avant de faire votre demande',
	'result.lead.not_enough_information_yet':
		'Nous avons besoin d’un peu plus d’informations avant de suggérer une prochaine étape',
	'result.lead.another_route_may_fit_better': 'Cette voie n’est probablement pas la bonne pour vous'
} satisfies Partial<Record<MessageKey, string>>
