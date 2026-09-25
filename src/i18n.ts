import { createContext, useContext } from 'react'
export const translations = {
  'Expertise': 'Експертиза', 'Stack': 'Стек', 'Connect': 'Контакти',
  'AI • AUTOMATION • FULL-STACK': 'AI • АВТОМАТИЗАЦІЯ • FULL-STACK',
  'Lviv, Ukraine': 'Львів, Україна', 'Remote worldwide.': 'Віддалена співпраця по всьому світу.',
  'Open to remote opportunities': 'Відкритий до віддалених пропозицій',
  'Nazarii': 'Назарій', 'Mudryk': 'Мудрик', 'Nazarii Mudryk': 'Назарій Мудрик',
  'AI Automation & Full-Stack Developer': 'Розробник AI-автоматизацій та Full-Stack рішень',
  'I build AI agents, web products, Telegram bots and automation systems that turn repetitive business processes into reliable software.': 'Створюю AI-агентів, вебпродукти, Telegram-ботів і системи автоматизації, які перетворюють повторювані бізнес-процеси на надійне програмне забезпечення.',
  'Let’s talk': 'Зв’язатися', 'View CV': 'Переглянути резюме',
  'From complex processes to clean solutions.': 'Від складних процесів до зрозумілих рішень.',
  '2.5+ YEARS BUILDING SOFTWARE': 'Понад 2,5 року розробки програмного забезпечення',
  'WHAT I BUILD': 'ЩО Я СТВОРЮЮ', '01 — EXPERTISE': '01 — ЕКСПЕРТИЗА',
  'AI Agents & Business Automation': 'AI-агенти та автоматизація бізнесу',
  'Agents, integrations and workflows for repetitive business operations.': 'Агенти, інтеграції та робочі процеси для автоматизації повторюваних бізнес-операцій.',
  'Full-Stack Web Products': 'Full-Stack вебпродукти',
  'From product interface to backend architecture and deployment.': 'Від інтерфейсу продукту до backend-архітектури та розгортання.',
  'Backend APIs & Databases': 'Backend API та бази даних',
  'FastAPI services, secure APIs and reliable data layers.': 'FastAPI-сервіси, захищені API та надійні системи роботи з даними.',
  'Browser Automation & Scraping': 'Автоматизація браузера та збір даних',
  'Structured data collection and browser-driven workflows.': 'Структурований збір даних та автоматизовані браузерні процеси.',
  'Computer Vision & AI Media': 'Комп’ютерний зір та AI-медіа',
  'Vision pipelines and AI-powered media processing.': 'Системи комп’ютерного зору та обробка медіа за допомогою AI.',
  'IoT & Microcontrollers': 'IoT та мікроконтролери',
  'Connected prototypes with Raspberry Pi, ESP32 and Arduino.': 'Розробка підключених прототипів на Raspberry Pi, ESP32 та Arduino.',
  'AGENTS / LLMS / WORKFLOWS': 'АГЕНТИ / LLM / РОБОЧІ ПРОЦЕСИ',
  'REACT / NEXT.JS / TYPESCRIPT': 'REACT / NEXT.JS / TYPESCRIPT',
  'FASTAPI / POSTGRESQL / REDIS': 'FASTAPI / POSTGRESQL / REDIS',
  'PYTHON / BROWSER AUTOMATION': 'PYTHON / АВТОМАТИЗАЦІЯ БРАУЗЕРА',
  'VISION / IMAGE PROCESSING': 'КОМП’ЮТЕРНИЙ ЗІР / ОБРОБКА ЗОБРАЖЕНЬ',
  'RASPBERRY PI / ESP32 / ARDUINO': 'RASPBERRY PI / ESP32 / ARDUINO',
  'FIND ME ONLINE': 'МОЇ ПРОФІЛІ', '02 — CONNECT': '02 — КОНТАКТИ',
  'Explore the code': 'Переглянути код', 'The professional side': 'Професійний профіль',
  'Start a conversation': 'Написати мені', 'Beyond the keyboard': 'Життя поза кодом', 'Personal profile': 'Особистий профіль', 'Freelance profile': 'Фриланс-профіль',
  '03 — TOOLKIT': '03 — ІНСТРУМЕНТИ', 'The right tools.': 'Правильні інструменти.', 'Real-world solutions.': 'Практичні рішення.',
  'Development': 'Розробка', 'Infrastructure': 'Інфраструктура', 'Automation & AI': 'Автоматизація та AI', 'Hardware': 'Апаратні платформи',
  'AI Agents': 'AI-агенти', 'Browser Automation': 'Автоматизація браузера', 'Web Scraping': 'Збір вебданих', 'Telegram Bots': 'Telegram-боти', 'Computer Vision': 'Комп’ютерний зір',
  'HAVE SOMETHING IN MIND?': 'МАЄТЕ ІДЕЮ?', 'Let’s build something': 'Створімо рішення,', 'that works for you.': 'яке працює для вас.', 'Explore my CV': 'Переглянути моє резюме',
  'Available worldwide': 'Співпраця по всьому світу', 'Analytics preferences': 'Налаштування аналітики',
  'A little insight. Your choice.': 'Аналітика — за вашим вибором.',
  'With your permission, Google Analytics helps me understand site visits. Essential preferences stay on your device.': 'За вашою згодою Google Analytics допомагає аналізувати відвідування сайту. Необхідні налаштування зберігаються на вашому пристрої.',
  'Decline': 'Відхилити', 'Allow analytics': 'Дозволити аналітику',
  'Close analytics preferences': 'Закрити налаштування аналітики', 'Skip to content': 'Перейти до вмісту',
  'Main navigation': 'Основна навігація', 'Nazarii Mudryk home': 'Назарій Мудрик — головна',
  'Portrait of Nazarii Mudryk': 'Портрет Назарія Мудрика', 'Nazarii Mudryk — NM monogram': 'Назарій Мудрик — монограма NM',
  'Email Nazarii Mudryk': 'Написати Назарію Мудрику', 'Visit': 'Відкрити', '(opens in new tab)': '(у новій вкладці)',
} as const
export type TranslationKey = keyof typeof translations
export type Language = 'en' | 'uk'
export const LanguageContext = createContext<Language>('en')
export function useT() {
  const language = useContext(LanguageContext)
  return (key: TranslationKey) => language === 'uk' ? translations[key] : key
}
export function initialLanguage(): Language {
  try { return localStorage.getItem('nm-language') === 'uk' ? 'uk' : 'en' } catch { return 'en' }
}
