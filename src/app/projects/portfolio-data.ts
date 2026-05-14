import type { Language } from "../components/language";

export const portfolioUrl = "https://portfolio.phamdaibang.com/";

export type PortfolioProject = {
	slug: string;
	title: string;
	meta: string;
	description: string;
	points: string[];
	scope: string[];
	results: string[];
	related: string[];
};

export const projectsCopy: Record<
	Language,
	{
		eyebrow: string;
		title: string;
		intro: string;
		openPortfolio: string;
		readMore: string;
	}
> = {
	en: {
		eyebrow: "Portfolio",
		title: "Projects, roles, and campaigns",
		intro:
			"A selected view of Pham Dai Bang's portfolio across business development, operations, human development, community building, writing, and content production.",
		openPortfolio: "Open full portfolio",
		readMore: "View details",
	},
	vi: {
		eyebrow: "Portfolio",
		title: "Dự án, vai trò và chiến dịch",
		intro:
			"Một lát cắt portfolio của Phạm Đại Bàng qua các mảng phát triển kinh doanh, vận hành, phát triển con người, xây dựng cộng đồng, viết và sản xuất nội dung.",
		openPortfolio: "Mở portfolio đầy đủ",
		readMore: "Xem chi tiết",
	},
};

export const projectDetailCopy: Record<
	Language,
	{
		back: string;
		scope: string;
		results: string;
		related: string;
		portfolio: string;
		missingTitle: string;
		missingBody: string;
	}
> = {
	en: {
		back: "Back to projects",
		scope: "Scope",
		results: "Selected results",
		related: "Related work",
		portfolio: "Open full portfolio",
		missingTitle: "Project not found",
		missingBody: "This portfolio item is not available.",
	},
	vi: {
		back: "Quay lại Projects",
		scope: "Phạm vi",
		results: "Kết quả chọn lọc",
		related: "Việc liên quan",
		portfolio: "Mở portfolio đầy đủ",
		missingTitle: "Không tìm thấy project",
		missingBody: "Mục portfolio này chưa có sẵn.",
	},
};

export const portfolioProjects: Record<Language, PortfolioProject[]> = {
	en: [
		{
			slug: "compassio",
			title: "Compassio",
			meta: "Project Manager, founding member | 2019-present",
			description:
				"Built and operated wellbeing and human development programs, connecting experts, facilitators, partners, and communities across talks, workshops, publications, and corporate learning.",
			points: [
				"Produced 50+ events and programs for individuals and organizations.",
				"Worked with corporate clients including Generali, Adidas, Unilever, B.A.T Vietnam, and other wellbeing partners.",
				"Led content design, program proposals, operations, facilitation, partnership, and community development.",
			],
			scope: [
				"Project strategy, planning, coordination, operations, partnership, and resource seeking.",
				"Program design for emotional intelligence, mental healthcare, self-awareness, relationship, happiness at work, and positive leadership.",
				"Facilitation and training for individual clients, communities, and organizations.",
			],
			results: [
				"Produced 50+ events and programs for individuals and organizations.",
				"Developed Compassio website, podcast, expert talks, publication concepts, and long-term content strategy.",
				"Connected experts, partners, speakers, and client communities around wellbeing and human development.",
			],
			related: [
				"Compassion Expert Talk",
				"Fulfill Live",
				"Emotional Compass",
				"Understanding Emotions",
			],
		},
		{
			slug: "giao-hang-nhanh",
			title: "Giao Hang Nhanh",
			meta: "Sales Manager, founding member | 2013-2015",
			description:
				"Developed the Northern market and built a customer network for one of Vietnam's major logistics players in the e-commerce period.",
			points: [
				"Contributed to bringing GHN into the top 5 in the industry.",
				"Worked cross-functionally with leadership, operations, and business teams.",
				"Handled sales campaigns, new markets, and relationships with major e-commerce partners.",
			],
			scope: [
				"Opened new markets and executed sales campaigns for logistics services.",
				"Managed, trained, and assigned work for the sales team.",
				"Built relationships with e-commerce partners, online shops, and business clients.",
			],
			results: [
				"Contributed to bringing GHN into the top 5 in the industry.",
				"Built experience with media partners, journalists, and TV channels through logistics and e-commerce communication.",
				"Developed a network of large e-commerce clients and active online sellers.",
			],
			related: [
				"VTV interview on logistics for e-commerce",
				"VTC program on Vietnam e-commerce market",
				"Big e-commerce client network",
			],
		},
		{
			slug: "the-coffee-house",
			title: "The Coffee House",
			meta: "Store Supervisor to Store Manager | 2015-2016",
			description:
				"Managed store operations, people, service quality, revenue, inventory, and financial control for a central HCMC branch.",
			points: [
				"Promoted from supervisor to store manager in 6 months.",
				"Managed a 14-person crew and daily store performance metrics.",
				"Set up and operated a new branch into a strong central District 1 location.",
			],
			scope: [
				"Daily store operations, customer service, hygiene, product quality, and revenue control.",
				"Inventory control, cost of goods sold, cancellation rate, customer satisfaction, and profit and loss.",
				"Recruiting, assigning, mentoring, and managing a 14-person crew.",
			],
			results: [
				"Promoted from supervisor to store manager in 6 months.",
				"Set up and operated a new branch into a strong central District 1 location.",
				"Built hands-on store management and service operations experience.",
			],
			related: [
				"Store operations",
				"Team management",
				"Service quality",
				"Finance and inventory control",
			],
		},
		{
			slug: "tomato-education",
			title: "Tomato Education",
			meta: "CEO Assistant, former Enrollment Coordinator | 2017-2018",
			description:
				"Supported the CEO and branches on enrollment, process standardization, operational coordination, and internal project execution.",
			points: [
				"Coordinated enrollment planning, parent consultation, workshops, and trial classes.",
				"Supported the company's process standardization project.",
				"Worked closely with branches, departments, managers, teachers, and partners.",
			],
			scope: [
				"Enrollment planning, parent consultation, workshops, and trial class organization.",
				"Branch coordination with academic teams, teachers, managers, and other departments.",
				"CEO support for strategic projects, partners, scheduling, and internal follow-through.",
			],
			results: [
				"Successfully supported the company's process standardization project.",
				"Completed key tasks set by the company and CEO.",
				"Built experience across education operations, sales, people coordination, and internal systems.",
			],
			related: [
				"Education operations",
				"Enrollment coordination",
				"Process standardization",
			],
		},
		{
			slug: "content-production",
			title: "Content Production",
			meta: "Editor-in-chief, producer, creator",
			description:
				"Used writing, audio, podcast, video, translation, and publication design as media for wellbeing, self-awareness, and community learning.",
			points: [
				"Led Compassio website, podcast, articles, scripts, audio recording, video production, and translation workflows.",
				"Developed publications and programs such as Emotional Compass, Understanding Emotions, and content creator communities.",
				"Produced personal writing, poetry, short fiction, recordings, and everyday-life video experiments.",
			],
			scope: [
				"Content strategy, editorial direction, translation, script approval, audio recording, and video production.",
				"Recruiting, training, and guiding editor and collaborator teams.",
				"Designing content products for psychology, emotional intelligence, workplace happiness, and personal development.",
			],
			results: [
				"Translated and wrote a large body of psychology and wellbeing content.",
				"Built Compassio website, Compassio Podcast, article systems, and multimedia production workflows.",
				"Developed publications and community programs such as Emotional Compass, Understanding Emotions, and content creator communities.",
			],
			related: [
				"Compassio Website",
				"Compassio Podcast",
				"Emotional Compass",
				"Loitavent",
				"The Loop",
			],
		},
		{
			slug: "personal-community-projects",
			title: "Personal & Community Projects",
			meta: "Founder, initiator, organizer",
			description:
				"Initiated and joined social, creative, and community projects around wellbeing, arts, music, self-awareness, and human development.",
			points: [
				"Founded or initiated Folks Foundation, Green Seagrass, Live House, Goahead Project, and other short-term programs.",
				"Built communities such as WIG - Wonderful Introversion Group and HSP Vietnam.",
				"Organized workshops, talks, contests, writing programs, art experiments, and community learning sessions.",
			],
			scope: [
				"Community design, event organization, content creation, writing programs, and experimental art formats.",
				"Building groups and communities around introversion, sensitivity, writing, wellbeing, music, and creative practice.",
				"Personal projects through blog, collaborations, social organizations, and independent channels.",
			],
			results: [
				"Founded or initiated Folks Foundation, Green Seagrass, Live House, Goahead Project, and other short-term programs.",
				"Built communities such as WIG - Wonderful Introversion Group and HSP Vietnam.",
				"Organized workshops, talks, contests, writing programs, art experiments, and community learning sessions.",
			],
			related: [
				"Folks Foundation",
				"Live House",
				"WIG",
				"HSP Vietnam",
				"Writing as a Happy Journey",
			],
		},
		{
			slug: "community-development",
			title: "Community Development",
			meta: "Social development, wellbeing, and self-awareness",
			description:
				"Long-running community work around emotional care, introversion, sensitivity, writing, wellbeing, and human development.",
			points: [
				"Developed Understanding Emotions, Understanding Yourself, and writing-focused wellbeing programs.",
				"Built and operated WIG - Wonderful Introversion Group and HSP Vietnam.",
				"Created community learning formats such as Crowdtalk, Crowdlearning, and guided writing sessions.",
			],
			scope: [
				"Community strategy, moderation, event design, content direction, and member development.",
				"Offline sessions, workshops, classes, and learning journeys around self-awareness and emotional care.",
				"Programs for content creators and new writers, including writing contests and publishing activities.",
			],
			results: [
				"Built communities with thousands of members and recurring offline activities.",
				"Expanded wellbeing and emotional-care topics through writing, translation, and live sessions.",
				"Connected social projects with experts, partners, and creative communities.",
			],
			related: [
				"Understanding Emotions",
				"WIG",
				"HSP Vietnam",
				"Crowdtalk",
				"Vietnam New Writer",
			],
		},
		{
			slug: "events-training",
			title: "Events & Training",
			meta: "Workshops, talks, courses, and corporate programs",
			description:
				"Designed, facilitated, and operated events and training programs for individuals, communities, and organizations.",
			points: [
				"Organized 10+ corporate events and 50+ individual/community events.",
				"Worked with topics such as resilience, empathy, growth mindset, happiness at work, and emotional intelligence.",
				"Collaborated with experts, speakers, facilitators, and partners to deliver learning experiences.",
			],
			scope: [
				"Program design, guest coordination, facilitator preparation, content layout, operations, and post-event communication.",
				"Corporate learning for wellbeing, employee engagement, stress management, and work-life balance.",
				"Community events including talks, workshops, movie screenings, and learning circles.",
			],
			results: [
				"Delivered programs for clients and partners including Generali, Adidas, Unilever, and B.A.T Vietnam.",
				"Hosted and facilitated events across wellbeing, emotion, career, and personal development topics.",
				"Built strong working relationships with experts, speakers, and partner networks.",
			],
			related: [
				"Wellbeing Retreat",
				"Stress Management",
				"Employee Engagement",
				"Happiness At Work",
			],
		},
		{
			slug: "writing-corner",
			title: "Writing Corner",
			meta: "Blog, poetry, fiction, essays, and personal reflection",
			description:
				"A quiet writing space for everyday thoughts, fiction and non-fiction, poetry, notes, and reflective experiments.",
			points: [
				"Built the personal blog as a writing corner for contemplation and dialogue with readers.",
				"Published musings, fiction, non-fiction, poetry, notes, and personal observations.",
				"Connected the blog with the broader Pham Dai Bang identity and portfolio.",
			],
			scope: [
				"Personal essay, short fiction, poetry, observation, notes, and writing experiments.",
				"Editorial positioning for a reflective, quiet, word-centered blog experience.",
				"Blog design and public presence through the main phamdaibang.com website.",
			],
			results: [
				"Created a dedicated writing corner under the Pham Dai Bang identity.",
				"Defined content pillars including A Cup of Words, fiction and non-fiction, poetry, and notes.",
				"Prepared the blog as a long-term publishing channel alongside portfolio and projects.",
			],
			related: [
				"A Cup of Words",
				"Fiction & Non-Fiction",
				"The Breath of Poetry",
				"Notes & Random Posts",
			],
		},
		{
			slug: "business-technology-activities",
			title: "Business & Technology Activities",
			meta: "Business, communication, sales, and technology application",
			description:
				"Applied broad communication and sales skills for business, management, personal branding, and technology-enabled operations.",
			points: [
				"Worked across business development, sales management, operations, and technology-aware administration.",
				"Applied tools and systems to support sales, operations, and management workflows.",
				"Combined communication, sales, and human-development skills across different industries.",
			],
			scope: [
				"Business development, sales campaigns, customer network building, and operational process improvement.",
				"Technology understanding, trend awareness, and practical tool usage for administration and operations.",
				"Cross-functional work with leaders, entrepreneurs, managers, and expert networks.",
			],
			results: [
				"Built experience across logistics, F&B, education, wellbeing, and creative/community projects.",
				"Developed both execution-level and management/strategy-level skills.",
				"Connected business purpose with communication, content, and social value.",
			],
			related: [
				"Giao Hang Nhanh",
				"The Coffee House",
				"Tomato Education",
				"Compassio",
			],
		},
		{
			slug: "achievements-network",
			title: "Achievements & Network",
			meta: "Awards, education, media, partners, and expert network",
			description:
				"A collection of education, awards, media appearances, professional relationships, and partner networks built across years of work.",
			points: [
				"Graduated from National Economics University and joined management and leadership learning programs.",
				"Recognized through startup and business contests including Kawai and Uom Mam Kinh Doanh.",
				"Built strong relationships with experts, speakers, editors, journalists, TV channels, and partner networks.",
			],
			scope: [
				"Education, certification, contests, startup activities, media interviews, and professional networking.",
				"Expert, speaker, editor, journalist, and partner relationship development.",
				"Network support for content, events, training, recruiting, and business development.",
			],
			results: [
				"Built a cross-field network spanning business, media, wellbeing, education, and creative communities.",
				"Maintained access to high-quality experts, partners, editors, and collaborators.",
				"Used network strength to support events, programs, content production, and business goals.",
			],
			related: [
				"National Economics University",
				"Kawai Startup Contest",
				"Start-up Nation",
				"Media partners",
			],
		},
	],
	vi: [
		{
			slug: "compassio",
			title: "Compassio",
			meta: "Project Manager, founding member | 2019-nay",
			description:
				"Xây dựng và vận hành các chương trình wellbeing và phát triển con người, kết nối chuyên gia, facilitator, đối tác và cộng đồng qua talk, workshop, publication và corporate learning.",
			points: [
				"Sản xuất hơn 50 sự kiện và chương trình cho cá nhân, cộng đồng và tổ chức.",
				"Làm việc với các khách hàng/tổ chức như Generali, Adidas, Unilever, B.A.T Vietnam và nhiều đối tác wellbeing.",
				"Phụ trách thiết kế nội dung, proposal chương trình, vận hành, facilitation, partnership và phát triển cộng đồng.",
			],
			scope: [
				"Chiến lược dự án, lập kế hoạch, điều phối, vận hành, partnership và tìm kiếm nguồn lực.",
				"Thiết kế chương trình về emotional intelligence, mental healthcare, self-awareness, relationship, happiness at work và positive leadership.",
				"Facilitation và training cho cá nhân, cộng đồng và tổ chức.",
			],
			results: [
				"Sản xuất hơn 50 sự kiện và chương trình cho cá nhân và tổ chức.",
				"Phát triển Compassio website, podcast, expert talks, ý tưởng publication và chiến lược nội dung dài hạn.",
				"Kết nối chuyên gia, đối tác, speaker và cộng đồng khách hàng quanh wellbeing và phát triển con người.",
			],
			related: [
				"Compassion Expert Talk",
				"Fulfill Live / Sống Đủ Đầy",
				"La Bàn Cảm Xúc",
				"Understanding Emotions",
			],
		},
		{
			slug: "giao-hang-nhanh",
			title: "Giao Hàng Nhanh",
			meta: "Sales Manager, founding member | 2013-2015",
			description:
				"Phát triển thị trường miền Bắc và xây dựng mạng lưới khách hàng cho một trong các doanh nghiệp logistics quan trọng của giai đoạn e-commerce tại Việt Nam.",
			points: [
				"Góp phần đưa GHN vào nhóm top 5 trong ngành.",
				"Làm việc cross-functional với leadership, operations và business team.",
				"Triển khai chiến dịch sales, mở thị trường mới và chăm sóc quan hệ với các đối tác e-commerce lớn.",
			],
			scope: [
				"Mở thị trường mới và triển khai chiến dịch sales cho dịch vụ logistics.",
				"Quản lý, đào tạo và phân công công việc cho sales team.",
				"Xây dựng quan hệ với đối tác e-commerce, online shops và business clients.",
			],
			results: [
				"Góp phần đưa GHN vào nhóm top 5 trong ngành.",
				"Có kinh nghiệm với media partners, journalists và TV channels trong truyền thông logistics/e-commerce.",
				"Phát triển mạng lưới khách hàng e-commerce lớn và các online sellers hoạt động thực tế.",
			],
			related: [
				"VTV interview về logistics cho e-commerce",
				"VTC program về Vietnam e-commerce market",
				"Big e-commerce client network",
			],
		},
		{
			slug: "the-coffee-house",
			title: "The Coffee House",
			meta: "Store Supervisor to Store Manager | 2015-2016",
			description:
				"Quản lý vận hành cửa hàng, nhân sự, chất lượng dịch vụ, doanh thu, tồn kho và tài chính tại chi nhánh trung tâm TP.HCM.",
			points: [
				"Từ supervisor lên store manager trong 6 tháng.",
				"Quản lý đội ngũ 14 nhân sự và các chỉ số vận hành hằng ngày.",
				"Set up và vận hành chi nhánh mới thành một điểm mạnh ở trung tâm Quận 1.",
			],
			scope: [
				"Vận hành hằng ngày, customer service, vệ sinh, chất lượng sản phẩm và kiểm soát doanh thu.",
				"Kiểm soát tồn kho, cost of goods sold, cancellation rate, customer satisfaction và profit and loss.",
				"Tuyển dụng, phân công, mentoring và quản lý đội ngũ 14 nhân sự.",
			],
			results: [
				"Từ supervisor lên store manager trong 6 tháng.",
				"Set up và vận hành chi nhánh mới thành một điểm mạnh ở trung tâm Quận 1.",
				"Tích lũy kinh nghiệm thực chiến về store management và service operations.",
			],
			related: [
				"Store operations",
				"Team management",
				"Service quality",
				"Finance and inventory control",
			],
		},
		{
			slug: "tomato-education",
			title: "Tomato Education",
			meta: "CEO Assistant, former Enrollment Coordinator | 2017-2018",
			description:
				"Hỗ trợ CEO và các chi nhánh trong tuyển sinh, chuẩn hóa quy trình, điều phối vận hành và triển khai dự án nội bộ.",
			points: [
				"Điều phối kế hoạch tuyển sinh, tư vấn phụ huynh, workshop và trial class.",
				"Hỗ trợ dự án chuẩn hóa quy trình của công ty.",
				"Làm việc cùng chi nhánh, phòng ban, quản lý, giáo viên và đối tác.",
			],
			scope: [
				"Enrollment planning, parent consultation, workshop và tổ chức trial class.",
				"Điều phối chi nhánh với academic teams, teachers, managers và các phòng ban.",
				"Hỗ trợ CEO trong strategic projects, partners, scheduling và follow-through nội bộ.",
			],
			results: [
				"Hỗ trợ thành công dự án chuẩn hóa quy trình của công ty.",
				"Hoàn thành các nhiệm vụ trọng yếu theo yêu cầu công ty và CEO.",
				"Tích lũy kinh nghiệm về education operations, sales, people coordination và internal systems.",
			],
			related: [
				"Education operations",
				"Enrollment coordination",
				"Process standardization",
			],
		},
		{
			slug: "content-production",
			title: "Content Production",
			meta: "Editor-in-chief, producer, creator",
			description:
				"Sử dụng viết, audio, podcast, video, dịch thuật và publication design như chất liệu cho wellbeing, self-awareness và community learning.",
			points: [
				"Phụ trách Compassio website, podcast, article, script, audio recording, video production và quy trình dịch thuật.",
				"Phát triển publication và chương trình như La Bàn Cảm Xúc, Understanding Emotions và các cộng đồng sáng tạo nội dung.",
				"Sản xuất viết cá nhân, thơ, truyện ngắn, bản ghi âm và video thử nghiệm từ đời sống hằng ngày.",
			],
			scope: [
				"Content strategy, editorial direction, translation, script approval, audio recording và video production.",
				"Recruiting, training và guiding editor/collaborator teams.",
				"Thiết kế content products cho psychology, emotional intelligence, workplace happiness và personal development.",
			],
			results: [
				"Dịch và viết một kho nội dung lớn về psychology và wellbeing.",
				"Xây dựng Compassio website, Compassio Podcast, article systems và multimedia production workflows.",
				"Phát triển publications và community programs như Emotional Compass, Understanding Emotions và content creator communities.",
			],
			related: [
				"Compassio Website",
				"Compassio Podcast",
				"La Bàn Cảm Xúc",
				"Loitavent",
				"The Loop",
			],
		},
		{
			slug: "personal-community-projects",
			title: "Personal & Community Projects",
			meta: "Founder, initiator, organizer",
			description:
				"Khởi xướng và tham gia các dự án xã hội, sáng tạo và cộng đồng xoay quanh wellbeing, nghệ thuật, âm nhạc, self-awareness và phát triển con người.",
			points: [
				"Sáng lập hoặc khởi xướng Folks Foundation, Cói Xanh, Live House, Goahead Project và nhiều chương trình ngắn hạn.",
				"Xây dựng các cộng đồng như WIG - Hướng Nội Tuyệt Vời và HSP Vietnam.",
				"Tổ chức workshop, talk, contest, chương trình viết, thử nghiệm nghệ thuật và các phiên học tập cộng đồng.",
			],
			scope: [
				"Community design, event organization, content creation, writing programs và các định dạng nghệ thuật thử nghiệm.",
				"Xây dựng nhóm và cộng đồng quanh introversion, sensitivity, writing, wellbeing, music và creative practice.",
				"Dự án cá nhân thông qua blog, collaborations, social organizations và independent channels.",
			],
			results: [
				"Sáng lập hoặc khởi xướng Folks Foundation, Green Seagrass, Live House, Goahead Project và các short-term programs.",
				"Xây dựng cộng đồng như WIG - Hướng Nội Tuyệt Vời và HSP Vietnam.",
				"Tổ chức workshops, talks, contests, writing programs, art experiments và community learning sessions.",
			],
			related: [
				"Folks Foundation",
				"Live House",
				"WIG",
				"HSP Vietnam",
				"Writing as a Happy Journey",
			],
		},
		{
			slug: "community-development",
			title: "Community Development",
			meta: "Social development, wellbeing và self-awareness",
			description:
				"Các hoạt động cộng đồng dài hạn xoay quanh chăm sóc cảm xúc, hướng nội, nhạy cảm cao, viết, wellbeing và phát triển con người.",
			points: [
				"Phát triển Understanding Emotions, Understanding Yourself và các chương trình viết ứng dụng trong wellbeing.",
				"Xây dựng và vận hành WIG - Hướng Nội Tuyệt Vời và HSP Vietnam.",
				"Tạo các format học tập cộng đồng như Crowdtalk, Crowdlearning và guided writing sessions.",
			],
			scope: [
				"Chiến lược cộng đồng, moderation, thiết kế sự kiện, định hướng nội dung và phát triển thành viên.",
				"Offline sessions, workshops, classes và learning journeys quanh self-awareness và emotional care.",
				"Chương trình cho content creators và người viết mới, gồm contests và publishing activities.",
			],
			results: [
				"Xây dựng cộng đồng với hàng nghìn thành viên và các hoạt động offline lặp lại.",
				"Mở rộng chủ đề wellbeing và emotional care thông qua viết, dịch thuật và live sessions.",
				"Kết nối các dự án xã hội với chuyên gia, đối tác và cộng đồng sáng tạo.",
			],
			related: [
				"Understanding Emotions",
				"WIG",
				"HSP Vietnam",
				"Crowdtalk",
				"Vietnam New Writer",
			],
		},
		{
			slug: "events-training",
			title: "Events & Training",
			meta: "Workshops, talks, courses và corporate programs",
			description:
				"Thiết kế, facilitation và vận hành sự kiện/chương trình đào tạo cho cá nhân, cộng đồng và tổ chức.",
			points: [
				"Tổ chức hơn 10 corporate events và hơn 50 individual/community events.",
				"Làm việc với các chủ đề resilience, empathy, growth mindset, happiness at work và emotional intelligence.",
				"Hợp tác với experts, speakers, facilitators và partners để tạo trải nghiệm học tập.",
			],
			scope: [
				"Program design, guest coordination, facilitator preparation, content layout, operations và post-event communication.",
				"Corporate learning về wellbeing, employee engagement, stress management và work-life balance.",
				"Community events gồm talks, workshops, movie screenings và learning circles.",
			],
			results: [
				"Triển khai chương trình cho clients/partners như Generali, Adidas, Unilever và B.A.T Vietnam.",
				"Host và facilitate các sự kiện về wellbeing, emotion, career và personal development.",
				"Xây dựng quan hệ tốt với experts, speakers và partner networks.",
			],
			related: [
				"Wellbeing Retreat",
				"Stress Management",
				"Employee Engagement",
				"Happiness At Work",
			],
		},
		{
			slug: "writing-corner",
			title: "Writing Corner",
			meta: "Blog, thơ, fiction, essay và phản tư cá nhân",
			description:
				"Một góc viết yên tĩnh cho suy nghĩ hằng ngày, fiction/non-fiction, thơ, ghi chú và các thử nghiệm phản tư.",
			points: [
				"Xây dựng blog cá nhân như một writing corner cho sự suy ngẫm và đối thoại với độc giả.",
				"Xuất bản musings, fiction, non-fiction, poetry, notes và các quan sát cá nhân.",
				"Kết nối blog với nhận diện Phạm Đại Bàng và portfolio rộng hơn.",
			],
			scope: [
				"Personal essay, short fiction, poetry, observation, notes và writing experiments.",
				"Định vị editorial cho một trải nghiệm blog tĩnh, phản tư và tập trung vào chữ.",
				"Thiết kế blog và public presence trong website chính phamdaibang.com.",
			],
			results: [
				"Tạo một writing corner riêng dưới nhận diện Phạm Đại Bàng.",
				"Định nghĩa các trụ cột nội dung như A Cup of Words, fiction/non-fiction, poetry và notes.",
				"Chuẩn bị blog như một kênh publishing dài hạn song song với portfolio và projects.",
			],
			related: [
				"A Cup of Words",
				"Fiction & Non-Fiction",
				"The Breath of Poetry",
				"Notes & Random Posts",
			],
		},
		{
			slug: "business-technology-activities",
			title: "Business & Technology Activities",
			meta: "Business, communication, sales và ứng dụng công nghệ",
			description:
				"Ứng dụng năng lực communication và sales cho business, management, personal branding và vận hành có hỗ trợ bởi công nghệ.",
			points: [
				"Làm việc qua business development, sales management, operations và technology-aware administration.",
				"Ứng dụng tools và systems để hỗ trợ sales, operations và management workflows.",
				"Kết hợp communication, sales và human-development skills qua nhiều ngành.",
			],
			scope: [
				"Business development, sales campaigns, customer network building và operational process improvement.",
				"Hiểu công nghệ, xu hướng và sử dụng công cụ thực tế cho administration/operations.",
				"Làm việc cross-functional với leaders, entrepreneurs, managers và expert networks.",
			],
			results: [
				"Tích lũy kinh nghiệm qua logistics, F&B, education, wellbeing và creative/community projects.",
				"Phát triển cả execution-level skills và management/strategy-level skills.",
				"Kết nối business purpose với communication, content và social value.",
			],
			related: [
				"Giao Hàng Nhanh",
				"The Coffee House",
				"Tomato Education",
				"Compassio",
			],
		},
		{
			slug: "achievements-network",
			title: "Achievements & Network",
			meta: "Awards, education, media, partners và expert network",
			description:
				"Tập hợp học vấn, giải thưởng, xuất hiện truyền thông, quan hệ nghề nghiệp và partner networks được xây dựng qua nhiều năm làm việc.",
			points: [
				"Tốt nghiệp National Economics University và tham gia các chương trình management/leadership learning.",
				"Có ghi nhận qua startup/business contests như Kawai và Ươm Mầm Kinh Doanh.",
				"Xây dựng quan hệ với experts, speakers, editors, journalists, TV channels và partner networks.",
			],
			scope: [
				"Education, certification, contests, startup activities, media interviews và professional networking.",
				"Phát triển quan hệ với experts, speakers, editors, journalists và partners.",
				"Hỗ trợ network cho content, events, training, recruiting và business development.",
			],
			results: [
				"Xây dựng network đa lĩnh vực qua business, media, wellbeing, education và creative communities.",
				"Duy trì kết nối với experts, partners, editors và collaborators chất lượng.",
				"Dùng sức mạnh network để hỗ trợ events, programs, content production và business goals.",
			],
			related: [
				"National Economics University",
				"Kawai Startup Contest",
				"Start-up Nation",
				"Media partners",
			],
		},
	],
};

export const projectSlugs = portfolioProjects.en.map((project) => project.slug);
