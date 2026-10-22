import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data Directory Persistence (works locally & in containers)
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.warn('Could not create data dir:', e);
  }
}

// 10 Standard VIP Packages
const DEFAULT_PACKAGES = [
  {
    id: 'vip-1',
    tier: 1,
    name: 'VIP 1 Starter',
    nameBn: 'ভিআইপি ১ স্টারটার',
    price: 500,
    dailyIncome: 50,
    validityDays: 30,
    dailyAds: 5,
    isActive: true,
    description: 'Entry package for beginners with high daily ROI',
    badgeColor: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'vip-2',
    tier: 2,
    name: 'VIP 2 Bronze',
    nameBn: 'ভিআইপি ২ ব্রোঞ্জ',
    price: 1000,
    dailyIncome: 110,
    validityDays: 30,
    dailyAds: 10,
    isActive: true,
    description: 'Double your earning potential with fast return',
    badgeColor: 'from-amber-600 to-orange-600',
  },
  {
    id: 'vip-3',
    tier: 3,
    name: 'VIP 3 Silver',
    nameBn: 'ভিআইপি ৩ সিলভার',
    price: 2000,
    dailyIncome: 230,
    validityDays: 30,
    dailyAds: 15,
    isActive: true,
    description: 'Most popular package among active community members',
    badgeColor: 'from-slate-400 to-zinc-600',
  },
  {
    id: 'vip-4',
    tier: 4,
    name: 'VIP 4 Gold',
    nameBn: 'ভিআইপি ৪ গোল্ড',
    price: 3000,
    dailyIncome: 360,
    validityDays: 35,
    dailyAds: 20,
    isActive: true,
    description: 'Enhanced profit tier with extended package validity',
    badgeColor: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'vip-5',
    tier: 5,
    name: 'VIP 5 Platinum',
    nameBn: 'ভিআইপি ৫ প্ল্যাটিনাম',
    price: 5000,
    dailyIncome: 650,
    validityDays: 40,
    dailyAds: 25,
    isActive: true,
    description: 'High return investment designed for regular earners',
    badgeColor: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'vip-6',
    tier: 6,
    name: 'VIP 6 Diamond',
    nameBn: 'ভিআইপি ৬ ডায়মন্ড',
    price: 10000,
    dailyIncome: 1350,
    validityDays: 45,
    dailyAds: 30,
    isActive: true,
    description: 'Premium tier with fast bKash & Nagad withdrawal priority',
    badgeColor: 'from-teal-400 to-emerald-600',
  },
  {
    id: 'vip-7',
    tier: 7,
    name: 'VIP 7 Crown',
    nameBn: 'ভিআইপি ৭ ক্রাউন',
    price: 15000,
    dailyIncome: 2100,
    validityDays: 50,
    dailyAds: 35,
    isActive: true,
    description: 'Elite level investment with guaranteed high daily payouts',
    badgeColor: 'from-purple-500 to-indigo-700',
  },
  {
    id: 'vip-8',
    tier: 8,
    name: 'VIP 8 Master',
    nameBn: 'ভিআইপি ৮ মাস্টার',
    price: 25000,
    dailyIncome: 3700,
    validityDays: 60,
    dailyAds: 40,
    isActive: true,
    description: 'Masterclass earning bracket with dedicated account priority',
    badgeColor: 'from-rose-500 to-red-700',
  },
  {
    id: 'vip-9',
    tier: 9,
    name: 'VIP 9 Grand Master',
    nameBn: 'ভিআইপি ৯ গ্র্যান্ড মাস্টার',
    price: 50000,
    dailyIncome: 7800,
    validityDays: 65,
    dailyAds: 45,
    isActive: true,
    description: 'Top enterprise level daily profit generator',
    badgeColor: 'from-fuchsia-600 to-purple-800',
  },
  {
    id: 'vip-10',
    tier: 10,
    name: 'VIP 10 Ultimate Sovereign',
    nameBn: 'ভিআইপি ১০ আলটিমেট সভরিন',
    price: 100000,
    dailyIncome: 16500,
    validityDays: 70,
    dailyAds: 50,
    isActive: true,
    description: 'The supreme VIP investment package of Earnlance BD',
    badgeColor: 'from-amber-400 via-yellow-300 to-yellow-600',
  },
];

const DEFAULT_BANNERS = [
  {
    id: 'ban-1',
    title: 'Earnlance BD Investment',
    subtitle: '100% Reliable Daily Income & Quick Payouts',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    linkText: 'Join VIP Now',
    tag: 'Official Launch',
    bgGradient: 'from-blue-900 via-indigo-900 to-slate-900',
    isActive: true,
  },
  {
    id: 'ban-2',
    title: 'VIP Daily Video Tasks',
    subtitle: 'ভিআইপি প্যাকেজ অনুযায়ী প্রতিদিন ভিডিও অ্যাড দেখে সাথে সাথে ব্যালেন্সে আয় নিন',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    linkText: 'Start Tasks',
    tag: 'Daily Work',
    bgGradient: 'from-sky-900 via-blue-950 to-slate-900',
    isActive: true,
  },
  {
    id: 'ban-3',
    title: 'Instant bKash & Nagad Cashout',
    subtitle: 'Safe, direct, and automated wallet withdrawals',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80',
    linkText: 'Check Wallet',
    tag: 'Fast Payout',
    bgGradient: 'from-amber-900 via-yellow-950 to-slate-900',
    isActive: true,
  },
  {
    id: 'ban-4',
    title: 'VIP Packages 1 to 10',
    subtitle: 'From 500 TK to 100,000 TK with high daily returns',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80',
    linkText: 'Upgrade Tier',
    tag: 'High Yield',
    bgGradient: 'from-purple-900 via-indigo-950 to-slate-900',
    isActive: true,
  },
  {
    id: 'ban-5',
    title: 'Earnlance Referral Program',
    subtitle: 'Earn direct commission by inviting your network',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    linkText: 'Invite Friends',
    tag: 'Commission',
    bgGradient: 'from-emerald-900 via-teal-950 to-slate-900',
    isActive: true,
  },
  {
    id: 'ban-6',
    title: 'One-Account Protection',
    subtitle: 'Strict security against duplicate numbers & fraud',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    linkText: 'Security Notice',
    tag: 'Safe & Secure',
    bgGradient: 'from-slate-800 via-slate-900 to-black',
    isActive: true,
  },
  {
    id: 'ban-7',
    title: '24/7 Live Support',
    subtitle: 'Send your query, the system will identify or verify and assist you',
    imageUrl: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800&auto=format&fit=crop&q=80',
    linkText: 'Get Support',
    tag: 'Live Chat',
    bgGradient: 'from-blue-950 via-slate-900 to-zinc-900',
    isActive: true,
  },
  {
    id: 'ban-8',
    title: 'Lifetime Single Purchase Rule',
    subtitle: 'Fair community policies: 1 package per lifetime per tier',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    linkText: 'Platform Rules',
    tag: 'Fair Play',
    bgGradient: 'from-stone-900 via-neutral-900 to-zinc-950',
    isActive: true,
  },
  {
    id: 'ban-9',
    title: 'Automated 24h Reset Timer',
    subtitle: 'Daily video tasks reset smoothly every 24 hours',
    imageUrl: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&auto=format&fit=crop&q=80',
    linkText: 'View Schedule',
    tag: 'Auto Reset',
    bgGradient: 'from-cyan-950 via-slate-900 to-slate-950',
    isActive: true,
  },
  {
    id: 'ban-10',
    title: 'Smart Investment, Real Profit',
    subtitle: 'Join thousands of satisfied Bangladeshi investors today',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    linkText: 'Get Started',
    tag: 'Earnlance BD',
    bgGradient: 'from-indigo-950 via-blue-900 to-slate-950',
    isActive: true,
  },
];

const DEFAULT_TASKS = [
  {
    id: 'task-1',
    title: 'Digital Marketing & Growth Ad',
    titleBn: 'ডিজিটাল মার্কেটিং ও গ্রোথ ভিডিও',
    sponsor: 'TechBD Global',
    category: 'Technology',
    durationSeconds: 6,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'task-2',
    title: 'Smart Fintech & Mobile Banking',
    titleBn: 'স্মার্ট ফিনটেক ও মোবাইল ব্যাংকিং',
    sponsor: 'PayStream Asia',
    category: 'Fintech',
    durationSeconds: 6,
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'task-3',
    title: 'E-Commerce Super Brand Promo',
    titleBn: 'ই-কমার্স ব্র্যান্ড স্পেশাল প্রোমো',
    sponsor: 'ShopBazaar BD',
    category: 'E-Commerce',
    durationSeconds: 6,
    thumbnail: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=500&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'task-4',
    title: 'Cloud Infrastructure & AI Tools',
    titleBn: 'ক্লাউড ইনফ্রাস্ট্রাকচার ও এআই টুলস',
    sponsor: 'Apex Cloud Systems',
    category: 'Artificial Intelligence',
    durationSeconds: 6,
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'task-5',
    title: 'Global Trade & Currency Exchange',
    titleBn: 'গ্লোবাল ট্রেড ও মুদ্রা বিনিময় বিজ্ঞাপন',
    sponsor: 'Prime FX International',
    category: 'Trading',
    durationSeconds: 6,
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80',
    isActive: true,
  },
];

const DEFAULT_FEED = [
  'Karim 1,200 TK Withdraw',
  'Rahim 500 TK Deposit',
  'Tanvir VIP 2 Activated',
  'Hasan 2,000 TK Deposit',
  'Sumon 3,500 TK Withdraw',
  'Faruk VIP 3 Activated',
  'Jamil 1,000 TK Deposit',
  'Arif 5,000 TK VIP 5 Activated',
  'Mahmud 1,800 TK Withdraw',
  'Rakib 500 TK Deposit',
  'Shuvo VIP 1 Activated',
  'Kamal 2,200 TK Withdraw',
];

const DEFAULT_PROMO_PHOTOS = [
  {
    id: 'promo-p1',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80',
    title: 'Earnlance BD দৈনিক ইনকাম ও ভিআইপি প্যাকেজ',
    description: 'আমাদের প্ল্যাটফর্মে আপনি প্রতিদিন সহজে বিজ্ঞাপন দেখে ইনকাম করতে পারবেন। কোনো হিডেন চার্জ ছাড়া বিকাশ ও নগদ এর মাধ্যমে টাকা উত্তোলন করা যায়। বন্ধুদের রেফার করে আজীবন ১০% পর্যন্ত কমিশন ও আকর্ষণীয় সাইন-আপ গিফট লুফে নিন!',
    isActive: true,
  },
  {
    id: 'promo-p2',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    title: 'রেফার করে আজীবন আকর্ষণীয় কমিশন ও রিওয়ার্ড',
    description: 'আপনার রেফারেল লিংকটি বন্ধুদের সাথে শেয়ার করুন। তারা যখনই নতুন আইডি খুলবে, সাথে সাথে আপনি পাবেন রেফারেল রিওয়ার্ড এবং তারা পাবে বিশেষ সাইন-আপ গিফট। পরবর্তীতে তাদের ভিআইপি প্যাকেজ কেনার ওপর নিয়মিত কমিশন পাওয়া যাবে।',
    isActive: true,
  },
  {
    id: 'promo-p3',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    title: 'সহজ ভিডিও অ্যাড দেখে ব্যালেন্সে টাকা আয়',
    description: 'দৈনিক মাত্র ৫ থেকে ১০ মিনিট সময় দিয়ে ভিডিও অ্যাড দেখে নিশ্চিত ইনকাম করুন। প্রতিটি প্যাকেজে রয়েছে আকর্ষণীয় দৈনিক রিটার্ন ও ১০০% বিশ্বস্ত পেমেন্ট প্রসেসিং।',
    isActive: true,
  },
  {
    id: 'promo-p4',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80',
    title: 'বিকাশ ও নগদ এর মাধ্যমে দ্রুত ক্যাশআউট',
    description: 'অটোমেটেড ক্যাশআউট সিস্টেমের মাধ্যমে বিকাশ ও নগদ একাউন্টে যেকোনো সময় টাকা তুলুন। সর্বনিম্ন উইথড্র মাত্র ২০০ টাকা থেকে শুরু!',
    isActive: true,
  },
];

const DEFAULT_PROMO_VIDEOS = [
  {
    id: 'promo-v1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'Earnlance BD প্ল্যাটফর্মে কিভাবে কাজ ও ইনকাম করবেন',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    description: 'এই ভিডিও টিউটোরিয়ালটিতে বিস্তারিত দেখানো হয়েছে কিভাবে নতুন একাউন্ট খুলে কাজ শুরু করবেন, ভিডিও অ্যাড দেখবেন এবং সহজেই বিকাশ বা নগদে টাকা উইথড্র করবেন।',
    isActive: true,
  },
  {
    id: 'promo-v2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    title: 'রেফারেল লিংক শেয়ার করে বন্ধুদের ইনভাইট করার নিয়ম',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    description: 'বন্ধুদের ইনভাইট করার সহজ কৌশল ও সোশ্যাল মিডিয়ায় রেফারেল লিংক শেয়ার করে প্রতিদিন আকর্ষণীয় কমিশন উপার্জনের বিস্তারিত গাইডলাইন।',
    isActive: true,
  },
];

interface DatabaseSchema {
  users: any[];
  packages: any[];
  banners: any[];
  tasks: any[];
  transactions: any[];
  supportMessages: any[];
  feedItems: string[];
  deletedPhones: string[];
  adminConfig: {
    adminPassword: string;
    bkashNumber: string;
    nagadNumber: string;
    bkashType: string;
    nagadType: string;
    minDeposit: number;
    minWithdraw: number;
    feedActive: boolean;
    customFeedItems?: string[];
    referralCommissionPercent?: number;
    referralSignupBonus?: number;
    referrerSignupReward?: number;
    referralPromoPhotos?: any[];
    referralPromoVideos?: any[];
    referralDashboardTitle?: string;
    referralDashboardSubtitle?: string;
    referralNoticeText?: string;
    referralStep1Title?: string;
    referralStep1Desc?: string;
    referralStep2Title?: string;
    referralStep2Desc?: string;
    referralStep3Title?: string;
    referralStep3Desc?: string;
    referralFaqOrRules?: string;
  };
}

function loadDatabase(): DatabaseSchema {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.users)) {
        if (!parsed.adminConfig) {
          parsed.adminConfig = {
            adminPassword: 'admin',
            bkashNumber: '01812345678',
            nagadNumber: '01798765432',
            bkashType: 'Send Money (Personal)',
            nagadType: 'Send Money (Personal)',
            minDeposit: 500,
            minWithdraw: 200,
            feedActive: true,
            customFeedItems: parsed.feedItems || DEFAULT_FEED,
          };
        }
        if (!parsed.adminConfig.customFeedItems) {
          parsed.adminConfig.customFeedItems = parsed.feedItems || DEFAULT_FEED;
        }
        if (parsed.adminConfig.referralCommissionPercent === undefined) {
          parsed.adminConfig.referralCommissionPercent = 10;
        }
        if (parsed.adminConfig.referralSignupBonus === undefined) {
          parsed.adminConfig.referralSignupBonus = 25;
        }
        if (parsed.adminConfig.referrerSignupReward === undefined) {
          parsed.adminConfig.referrerSignupReward = 10;
        }
        if (!parsed.adminConfig.referralPromoPhotos || parsed.adminConfig.referralPromoPhotos.length === 0) {
          parsed.adminConfig.referralPromoPhotos = DEFAULT_PROMO_PHOTOS;
        } else {
          // Ensure description is present
          parsed.adminConfig.referralPromoPhotos = parsed.adminConfig.referralPromoPhotos.map((p: any, idx: number) => ({
            ...p,
            description: p.description || DEFAULT_PROMO_PHOTOS[idx]?.description || 'প্রচার ছবির বিস্তারিত বর্ণনা ও ব্লগ টেক্সট।',
          }));
        }
        if (!parsed.adminConfig.referralPromoVideos || parsed.adminConfig.referralPromoVideos.length === 0) {
          parsed.adminConfig.referralPromoVideos = DEFAULT_PROMO_VIDEOS;
        } else {
          // Ensure description is present
          parsed.adminConfig.referralPromoVideos = parsed.adminConfig.referralPromoVideos.map((v: any, idx: number) => ({
            ...v,
            description: v.description || DEFAULT_PROMO_VIDEOS[idx]?.description || 'ভিডিও টিউটোরিয়াল ও রেফারেল গাইডলাইন।',
          }));
        }
        if (!parsed.adminConfig.referralDashboardTitle) {
          parsed.adminConfig.referralDashboardTitle = 'রেফার করুন এবং আজীবন আয় করুন';
        }
        if (!parsed.adminConfig.referralDashboardSubtitle) {
          parsed.adminConfig.referralDashboardSubtitle = 'আপনার রেফারেল লিংক বন্ধুদের সাথে শেয়ার করুন এবং তাদের রেজিস্ট্রেশন ও প্যাকেজ ক্রয়ের ওপর আকর্ষণীয় কমিশন ও উপহার উপভোগ করুন!';
        }
        if (!parsed.adminConfig.referralNoticeText) {
          parsed.adminConfig.referralNoticeText = 'বিশেষ অফার: আপনার রেফার করা বন্ধু একাউন্ট খুললেই পাচ্ছেন আকর্ষণীয় ক্যাশ বোনাস এবং আজীবন সর্বোচ্চ ১০% পর্যন্ত ভিআইপি কমিশন!';
        }
        if (!parsed.adminConfig.referralStep1Title) {
          parsed.adminConfig.referralStep1Title = 'লিংক শেয়ার করুন';
          parsed.adminConfig.referralStep1Desc = 'আপনার ইউনিক রেফারেল কোড বা লিংকটি হোয়াটসঅ্যাপ, ফেসবুক বা টেলিগ্রামে বন্ধুদের শেয়ার করুন।';
        }
        if (!parsed.adminConfig.referralStep2Title) {
          parsed.adminConfig.referralStep2Title = 'সফল রেজিস্ট্রেশন';
          parsed.adminConfig.referralStep2Desc = 'বন্ধুরা লিংকে ক্লিক করে নতুন একাউন্ট খুললেই পাবে সাইন-আপ গিফট এবং আপনি পাবেন রেফারেল রিওয়ার্ড।';
        }
        if (!parsed.adminConfig.referralStep3Title) {
          parsed.adminConfig.referralStep3Title = 'আজীবন কমিশন পান';
          parsed.adminConfig.referralStep3Desc = 'আপনার রেফার করা মেম্বার যেকোনো ভিআইপি প্যাকেজ কিনলে সাথে সাথে তার কমিশনের টাকা সরাসরি আপনার ব্যালেন্সে জমা হবে।';
        }
        if (!parsed.adminConfig.referralFaqOrRules) {
          parsed.adminConfig.referralFaqOrRules = 'নিয়মাবলী: ১. নিজের একাধিক ফেক একাউন্ট খুলে রেফার করা সম্পূর্ণ নিষিদ্ধ। ২. কমিশন সাথে সাথে মূল ব্যালেন্সে যোগ হবে যা যেকোনো সময় উত্তোলনযোগ্য। ৩. যেকোনো সহায়তায় ইন-অ্যাপ সাপোর্ট থেকে যোগাযোগ করুন।';
        }
        if (parsed.packages && Array.isArray(parsed.packages)) {
          parsed.packages = parsed.packages.map((pkg: any) => {
            if (!pkg.dailyAds) {
              pkg.dailyAds = pkg.tier === 1 ? 5 : pkg.tier === 2 ? 10 : (pkg.tier || 1) * 5;
            }
            return pkg;
          });
        }
        if (parsed.banners && Array.isArray(parsed.banners)) {
          parsed.banners = parsed.banners.map((b: any) => {
            if (b.id === 'ban-2' && (b.title === 'Daily 5 Task Watching' || b.title?.includes('5 Task'))) {
              b.title = 'VIP Daily Video Tasks';
              b.subtitle = 'ভিআইপি প্যাকেজ অনুযায়ী প্রতিদিন ভিডিও অ্যাড দেখে সাথে সাথে ব্যালেন্সে আয় নিন';
            }
            return b;
          });
        }
        if (!parsed.deletedPhones) parsed.deletedPhones = [];
        return parsed;
      }
    } catch (e) {
      console.error('Error reading database file:', e);
    }
  }

  const initialDB: DatabaseSchema = {
    users: [],
    packages: DEFAULT_PACKAGES,
    banners: DEFAULT_BANNERS,
    tasks: DEFAULT_TASKS,
    transactions: [],
    supportMessages: [],
    feedItems: DEFAULT_FEED,
    deletedPhones: [],
    adminConfig: {
      adminPassword: 'admin',
      bkashNumber: '01812345678',
      nagadNumber: '01798765432',
      bkashType: 'Send Money (Personal)',
      nagadType: 'Send Money (Personal)',
      minDeposit: 500,
      minWithdraw: 200,
      feedActive: true,
      customFeedItems: [...DEFAULT_FEED],
      referralCommissionPercent: 10,
      referralSignupBonus: 25,
      referrerSignupReward: 10,
      referralPromoPhotos: DEFAULT_PROMO_PHOTOS,
      referralPromoVideos: DEFAULT_PROMO_VIDEOS,
    },
  };

  saveDatabase(initialDB);
  return initialDB;
}

let db = loadDatabase();

function saveDatabase(data?: DatabaseSchema) {
  try {
    const toSave = data || db;
    fs.writeFileSync(DB_FILE, JSON.stringify(toSave, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write to database file:', err);
  }
}

// Automatic Live Feed Helper (Per user request: auto updates on deposit, withdraw, VIP, task, register)
function pushAutoLiveFeed(text: string) {
  if (!db.feedItems) db.feedItems = [];
  db.feedItems.unshift(text);
  if (db.feedItems.length > 60) {
    db.feedItems = db.feedItems.slice(0, 60);
  }
  if (!db.adminConfig) db.adminConfig = {} as any;
  db.adminConfig.customFeedItems = db.feedItems;
  saveDatabase();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // 1. GET full state (Always ensures safe non-null arrays)
  app.get('/api/state', (req: Request, res: Response) => {
    if (!db.adminConfig) db.adminConfig = {} as any;
    if (!db.adminConfig.customFeedItems || db.adminConfig.customFeedItems.length === 0) {
      db.adminConfig.customFeedItems = db.feedItems || DEFAULT_FEED;
    }
    res.json(db);
  });

  // 2. Register User (Permanent Central Storage + Automatic Live Feed)
  app.post('/api/users/register', (req: Request, res: Response) => {
    const { phone, password, referralCode } = req.body;
    if (!phone || !password || !referralCode) {
      return res.status(400).json({ error: 'Missing required registration fields' });
    }

    const cleanPhone = phone.trim();
    const cleanRef = referralCode.trim().toUpperCase();

    // Check if phone was permanently deleted by admin
    if (db.deletedPhones?.includes(cleanPhone)) {
      return res.status(403).json({
        error: 'এই মোবাইল নাম্বারটির একাউন্ট মুছে ফেলা হয়েছে। আপনি আর রেজিস্ট্রেশন করতে পারবেন না।',
      });
    }

    // Check duplicate phone
    const existing = db.users.find((u) => u.phone === cleanPhone);
    if (existing) {
      return res.status(400).json({ error: 'এই মোবাইল নাম্বার দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে।' });
    }

    // Rule: Every referral code can ONLY create 1 account/ID once! After that it cannot be used anymore.
    const alreadyUsedCount = db.users.filter(
      (u) => u.referredBy?.toUpperCase() === cleanRef
    ).length;

    if (alreadyUsedCount >= 1) {
      return res.status(400).json({
        error: 'এই রেফারেল কোডটি ইতিমধ্যে একবার ব্যবহার করা হয়েছে। প্রতিটি রেফারেল কোড দিয়ে কেবল ১টি অ্যাকাউন্ট তৈরি সম্ভব, এর বেশি আর ব্যবহার করা যাবে না।',
      });
    }

    // Check referrer: allow existing user or secret master code
    const isMasterCode = ['EARNLANCE', 'OFFICIAL', 'VIP100', 'ADMIN01'].includes(cleanRef);
    const referrer = db.users.find((u) => u.referralCode?.toUpperCase() === cleanRef);
    
    if (!referrer && !isMasterCode) {
      return res.status(400).json({ error: 'রেফারেল কোডটি সঠিক নয়! অনুগ্রহ করে সঠিক রেফারেল কোড লিখুন।' });
    }

    const signupBonus = Number(db.adminConfig.referralSignupBonus ?? 25);
    const referrerReward = Number(db.adminConfig.referrerSignupReward ?? 10);

    const newReferralCode = 'EL' + Math.floor(100000 + Math.random() * 900000);
    const newUser = {
      id: `user_${Date.now()}`,
      phone: cleanPhone,
      password,
      balance: signupBonus,
      totalDeposit: 0,
      totalWithdraw: 0,
      totalEarned: signupBonus,
      referralCode: newReferralCode,
      referredBy: referrer ? referrer.referralCode : cleanRef,
      activePackageId: null,
      purchasedPackageIds: [],
      packageActivatedAt: null,
      bkashNagadNumber: null,
      withdrawPassword: null,
      paymentMethod: null,
      paymentDetailsSet: false,
      tasksCompletedToday: 0,
      lastTaskTimestamp: null,
      isBlocked: false,
      createdAt: new Date().toISOString(),
    };

    db.users.unshift(newUser);

    // Record signup bonus transaction for new member
    if (signupBonus > 0) {
      db.transactions.unshift({
        id: `tx-sign-${Date.now()}`,
        userId: newUser.id,
        userPhone: newUser.phone,
        type: 'signup_bonus',
        amount: signupBonus,
        status: 'approved',
        method: 'Wallet',
        packageName: 'রেফারেল জয়েনিং বোনাস',
        createdAt: new Date().toISOString(),
        note: `রেফারেল কোড (${referrer ? referrer.referralCode : cleanRef}) দিয়ে যোগ দেওয়ায় ৳${signupBonus} বোনাস প্রাপ্ত`,
      });
    }

    // Award referrer signup bonus
    if (referrer && referrerReward > 0) {
      referrer.balance = (referrer.balance || 0) + referrerReward;
      referrer.totalEarned = (referrer.totalEarned || 0) + referrerReward;
      db.transactions.unshift({
        id: `tx-ref-${Date.now()}`,
        userId: referrer.id,
        userPhone: referrer.phone,
        type: 'referral_bonus',
        amount: referrerReward,
        status: 'approved',
        method: 'Wallet',
        packageName: 'সফল রেফারেল বোনাস',
        createdAt: new Date().toISOString(),
        note: `নতুন সদস্য (${cleanPhone.slice(0, 3)}****${cleanPhone.slice(-3)}) জয়েন করায় ৳${referrerReward} রেফারেল বোনাস`,
      });
    }

    // Auto Live Feed Event: Karim or Phone format
    const masked = `${cleanPhone.slice(0, 3)}****${cleanPhone.slice(-3)}`;
    pushAutoLiveFeed(`${masked} Joined via Referral (+৳${signupBonus} Bonus)`);

    saveDatabase();
    res.json({ success: true, user: newUser });
  });

  // 3. Login
  app.post('/api/users/login', (req: Request, res: Response) => {
    const { phone, password } = req.body;
    const cleanPhone = (phone || '').trim();

    if (db.deletedPhones?.includes(cleanPhone)) {
      return res.status(403).json({
        error: 'আপনার অ্যাকাউন্টটি স্থায়ীভাবে মুছে ফেলা হয়েছে। আপনি আর লগইন করতে পারবেন না।',
      });
    }

    const user = db.users.find((u) => u.phone === cleanPhone && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'মোবাইল নাম্বার বা পাসওয়ার্ড সঠিক নয়' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ error: 'আপনার অ্যাকাউন্টটি সাময়িকভাবে ব্লক করা হয়েছে। সাপোর্টে যোগাযোগ করুন।' });
    }

    res.json({ success: true, user });
  });

  // 4. Update User
  app.put('/api/users/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.users.findIndex((u) => u.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.users[index] = { ...db.users[index], ...req.body };
    saveDatabase();
    res.json({ success: true, user: db.users[index] });
  });

  // 5. Block / Unblock User
  app.post('/api/users/toggle-block', (req: Request, res: Response) => {
    const { userId } = req.body;
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isBlocked = !user.isBlocked;
    saveDatabase();
    res.json({ success: true, isBlocked: user.isBlocked, user });
  });

  // 6. Delete User (Only Admin can delete; records deleted phone to block re-login)
  app.post('/api/admin/delete-user', (req: Request, res: Response) => {
    const { userId } = req.body;
    const user = db.users.find((u) => u.id === userId);
    if (user) {
      if (!db.deletedPhones) db.deletedPhones = [];
      if (!db.deletedPhones.includes(user.phone)) {
        db.deletedPhones.push(user.phone);
      }
    }
    db.users = db.users.filter((u) => u.id !== userId);
    saveDatabase();
    res.json({ success: true });
  });

  // 7. Admin: Create User without referral code
  app.post('/api/admin/create-user', (req: Request, res: Response) => {
    const { phone, password, initialBalance } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: 'মোবাইল নাম্বার ও পাসওয়ার্ড দিন' });
    }
    const cleanPhone = phone.trim();
    if (db.deletedPhones) {
      db.deletedPhones = db.deletedPhones.filter((p) => p !== cleanPhone);
    }
    const existing = db.users.find((u) => u.phone === cleanPhone);
    if (existing) {
      return res.status(400).json({ error: 'এই নাম্বার দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি আছে' });
    }

    const newReferralCode = 'EL' + Math.floor(100000 + Math.random() * 900000);
    const balanceNum = Number(initialBalance) || 0;
    const newUser = {
      id: `user_${Date.now()}`,
      phone: cleanPhone,
      password,
      balance: balanceNum,
      totalDeposit: balanceNum,
      totalWithdraw: 0,
      totalEarned: 0,
      referralCode: newReferralCode,
      referredBy: 'ADMIN',
      activePackageId: null,
      purchasedPackageIds: [],
      packageActivatedAt: null,
      bkashNagadNumber: cleanPhone,
      withdrawPassword: '1234',
      paymentMethod: 'bKash',
      paymentDetailsSet: false,
      tasksCompletedToday: 0,
      lastTaskTimestamp: null,
      isBlocked: false,
      createdAt: new Date().toISOString(),
    };

    db.users.unshift(newUser);
    saveDatabase();
    res.json({ success: true, user: newUser });
  });

  // 8. Admin: Adjust User Balance (Add or Deduct)
  app.post('/api/admin/adjust-balance', (req: Request, res: Response) => {
    const { userId, amount, type } = req.body;
    const user = db.users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      return res.status(400).json({ error: 'সঠিক টাকার পরিমাণ দিন' });
    }

    if (type === 'deduct') {
      if (user.balance < num) {
        return res.status(400).json({ error: 'ইউজারের ব্যালেন্সের চেয়ে বেশি টাকা কর্তন করা সম্ভব নয়' });
      }
      user.balance -= num;
    } else {
      user.balance += num;
      user.totalDeposit += num;
    }

    const tx = {
      id: `adj-${Date.now()}`,
      userId: user.id,
      userPhone: user.phone,
      type: type === 'add' ? 'admin_credit' : 'admin_debit',
      amount: num,
      status: 'approved',
      method: 'Admin Adjustment',
      createdAt: new Date().toISOString(),
    };
    db.transactions.unshift(tx);
    saveDatabase();
    res.json({ success: true, user, balance: user.balance });
  });

  // 9. Buy VIP Package (Auto Live Feed, Upgrade only, refund previous package price)
  app.post('/api/packages/purchase', (req: Request, res: Response) => {
    const { userId, packageId } = req.body;
    const user = db.users.find((u) => u.id === userId);
    const pkg = db.packages.find((p) => p.id === packageId);

    if (!user || !pkg) {
      return res.status(404).json({ error: 'User or package not found' });
    }

    // Check if package is active/enabled by admin
    if (!pkg.isActive) {
      return res.status(400).json({ error: 'এখনো চালু হয় নাই খুব শীঘ্রই এটা চালু করা হবে' });
    }

    // Downgrade check: User can only buy a higher tier / higher price package than current active
    if (user.activePackageId) {
      const currentPkg = db.packages.find((p) => p.id === user.activePackageId);
      if (currentPkg) {
        if (pkg.price < currentPkg.price || pkg.tier < currentPkg.tier) {
          return res.status(400).json({
            error: 'আপনি বড় প্যাকেজ থেকে ছোট প্যাকেজ কিনতে পারবেন না। শুধুমাত্র আপগ্রেড করতে পারবেন।',
          });
        }
      }
    }

    // Previous active package refund: automatically added to balance per user rule
    let refundedPrice = 0;
    if (user.activePackageId) {
      const prevPkg = db.packages.find((p) => p.id === user.activePackageId);
      if (prevPkg) {
        refundedPrice = prevPkg.price;
        user.balance += refundedPrice;
      }
    }

    if (user.balance < pkg.price) {
      // Rollback refund if still insufficient
      if (refundedPrice > 0) user.balance -= refundedPrice;
      return res.status(400).json({ error: 'অপর্যাপ্ত ব্যালেন্স' });
    }

    user.balance -= pkg.price;
    user.activePackageId = pkg.id;
    user.purchasedPackageIds = [...(user.purchasedPackageIds || []), pkg.id];
    user.packageActivatedAt = new Date().toISOString();
    user.tasksCompletedToday = 0;

    const tx = {
      id: `pkg-${Date.now()}`,
      userId: user.id,
      userPhone: user.phone,
      type: 'package_purchase',
      amount: pkg.price,
      status: 'approved',
      method: 'Wallet',
      packageName: pkg.name,
      createdAt: new Date().toISOString(),
    };
    db.transactions.unshift(tx);

    // Award Referral Commission to Referrer
    if (user.referredBy) {
      const referrer = db.users.find(
        (u) => u.referralCode?.toUpperCase() === user.referredBy?.toUpperCase()
      );
      if (referrer) {
        const commissionPercent = Number(db.adminConfig.referralCommissionPercent ?? 10);
        const commissionAmount = Math.round((pkg.price * (commissionPercent / 100)) * 100) / 100;
        if (commissionAmount > 0) {
          referrer.balance = Math.round((referrer.balance + commissionAmount) * 100) / 100;
          referrer.totalEarned = Math.round(((referrer.totalEarned || 0) + commissionAmount) * 100) / 100;

          const refTx = {
            id: `comm-${Date.now()}`,
            userId: referrer.id,
            userPhone: referrer.phone,
            type: 'referral_commission',
            amount: commissionAmount,
            status: 'approved',
            method: 'Wallet',
            packageName: `${pkg.name} (${commissionPercent}% কমিশন)`,
            createdAt: new Date().toISOString(),
            note: `রেফারেল সদস্য (${user.phone.slice(0, 3)}****${user.phone.slice(-3)}) ${pkg.name} ক্রয় করায় ${commissionPercent}% কমিশন প্রাপ্ত`,
          };
          db.transactions.unshift(refTx);

          const referrerMasked = `${referrer.phone.slice(0, 3)}****${referrer.phone.slice(-3)}`;
          pushAutoLiveFeed(`${referrerMasked} Received ৳${commissionAmount} Referral Commission`);
        }
      }
    }

    // Auto Live Feed Event
    const masked = `${user.phone.slice(0, 3)}****${user.phone.slice(-3)}`;
    pushAutoLiveFeed(`${masked} ${pkg.name} Activated`);

    saveDatabase();
    res.json({ success: true, user, refundedPrice });
  });

  // 10. Complete Task / Daily Earning (Auto Live Feed)
  app.post('/api/tasks/complete', (req: Request, res: Response) => {
    const { userId } = req.body;
    const user = db.users.find((u) => u.id === userId);
    if (!user || !user.activePackageId) {
      return res.status(400).json({ error: 'Active package required' });
    }

    const pkg = db.packages.find((p) => p.id === user.activePackageId);
    if (!pkg) {
      return res.status(400).json({ error: 'Package details not found' });
    }

    const targetAds = (pkg as any).dailyAds || (pkg.tier === 1 ? 5 : pkg.tier === 2 ? 10 : (pkg.tier || 1) * 5);
    const perAdIncome = Math.round((pkg.dailyIncome / targetAds) * 100) / 100;
    const currentCompleted = user.tasksCompletedToday || 0;

    if (currentCompleted >= targetAds) {
      return res.status(400).json({ error: 'আজকের সব কাজ ইতিমধ্যে সম্পন্ন হয়েছে!' });
    }

    const nextTasks = currentCompleted + 1;
    user.tasksCompletedToday = nextTasks;
    user.balance = Math.round((user.balance + perAdIncome) * 100) / 100;
    user.totalEarned = Math.round(((user.totalEarned || 0) + perAdIncome) * 100) / 100;

    const isAllCompleted = nextTasks >= targetAds;
    if (isAllCompleted) {
      user.lastTaskTimestamp = Date.now();
    }

    const tx = {
      id: `inc-${Date.now()}`,
      userId: user.id,
      userPhone: user.phone,
      type: 'task_income',
      amount: perAdIncome,
      status: 'approved',
      method: 'Wallet',
      packageName: `${pkg.name} (Ad ${nextTasks}/${targetAds})`,
      createdAt: new Date().toISOString(),
    };
    db.transactions.unshift(tx);

    // Auto Live Feed Event
    const masked = `${user.phone.slice(0, 3)}****${user.phone.slice(-3)}`;
    pushAutoLiveFeed(`${masked} Earned ৳${perAdIncome} from Task #${nextTasks}`);

    saveDatabase();
    res.json({ success: true, user, perAdIncome, isAllCompleted, targetAds });
  });

  // 11. Deposit Request (Auto Live Feed)
  app.post('/api/transactions/deposit', (req: Request, res: Response) => {
    const { userId, amount, method, senderNumber, trxId } = req.body;
    const user = db.users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const tx = {
      id: `dep-${Date.now()}`,
      userId: user.id,
      userPhone: user.phone,
      type: 'deposit',
      amount: Number(amount),
      status: 'pending',
      method,
      accountNumber: senderNumber,
      trxId,
      createdAt: new Date().toISOString(),
    };
    db.transactions.unshift(tx);

    // Auto Live Feed Event
    const masked = `${user.phone.slice(0, 3)}****${user.phone.slice(-3)}`;
    pushAutoLiveFeed(`${masked} ${Number(amount).toLocaleString()} TK Deposit`);

    saveDatabase();
    res.json({ success: true, transaction: tx });
  });

  // 12. Withdraw Request (Auto Live Feed)
  app.post('/api/transactions/withdraw', (req: Request, res: Response) => {
    const { userId, amount, withdrawPassword } = req.body;
    const user = db.users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.withdrawPassword !== withdrawPassword) {
      return res.status(400).json({ error: 'ভুল উইথড্র পাসওয়ার্ড' });
    }

    const numAmount = Number(amount);
    if (user.balance < numAmount) {
      return res.status(400).json({ error: 'অপর্যাপ্ত ব্যালেন্স' });
    }

    user.balance -= numAmount;

    const tx = {
      id: `wth-${Date.now()}`,
      userId: user.id,
      userPhone: user.phone,
      type: 'withdraw',
      amount: numAmount,
      status: 'pending',
      method: user.paymentMethod || 'bKash',
      accountNumber: user.bkashNagadNumber || user.phone,
      createdAt: new Date().toISOString(),
    };
    db.transactions.unshift(tx);

    // Auto Live Feed Event
    const masked = `${user.phone.slice(0, 3)}****${user.phone.slice(-3)}`;
    pushAutoLiveFeed(`${masked} ${numAmount.toLocaleString()} TK Withdraw`);

    saveDatabase();
    res.json({ success: true, transaction: tx, user });
  });

  // 13. Approve / Reject Transaction (Auto credits/deducts user balance on server)
  app.post('/api/transactions/status', (req: Request, res: Response) => {
    const { txId, status } = req.body;
    const tx = db.transactions.find((t) => t.id === txId);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });

    tx.status = status;

    const user = db.users.find((u) => u.id === tx.userId);
    if (user) {
      if (status === 'approved') {
        if (tx.type === 'deposit') {
          user.balance += tx.amount;
          user.totalDeposit += tx.amount;

          const masked = `${user.phone.slice(0, 3)}****${user.phone.slice(-3)}`;
          pushAutoLiveFeed(`${masked} ${tx.amount.toLocaleString()} TK Deposit Approved`);
        } else if (tx.type === 'withdraw') {
          user.totalWithdraw += tx.amount;

          const masked = `${user.phone.slice(0, 3)}****${user.phone.slice(-3)}`;
          pushAutoLiveFeed(`${masked} ${tx.amount.toLocaleString()} TK Withdraw Sent`);
        }
      } else if (status === 'rejected' && tx.type === 'withdraw') {
        // Refund held balance back to user
        user.balance += tx.amount;
      }
    }

    saveDatabase();
    res.json({ success: true, transaction: tx, user });
  });

  // 14. Admin Config Update
  app.post('/api/admin/config', (req: Request, res: Response) => {
    db.adminConfig = { ...db.adminConfig, ...req.body };
    saveDatabase();
    res.json({ success: true, adminConfig: db.adminConfig });
  });

  // 15. Admin Packages Update
  app.post('/api/admin/packages', (req: Request, res: Response) => {
    db.packages = req.body.packages;
    saveDatabase();
    res.json({ success: true, packages: db.packages });
  });

  // 16. Admin Banners Update
  app.post('/api/admin/banners', (req: Request, res: Response) => {
    db.banners = req.body.banners;
    saveDatabase();
    res.json({ success: true, banners: db.banners });
  });

  // 17. Admin Tasks Update
  app.post('/api/admin/tasks', (req: Request, res: Response) => {
    db.tasks = req.body.tasks;
    saveDatabase();
    res.json({ success: true, tasks: db.tasks });
  });

  // 18. Admin Users Update
  app.post('/api/admin/users', (req: Request, res: Response) => {
    db.users = req.body.users;
    saveDatabase();
    res.json({ success: true, users: db.users });
  });

  // 19. Support Messages
  app.post('/api/support/message', (req: Request, res: Response) => {
    const { userId, text, sender } = req.body;
    const msg = {
      id: `msg-${Date.now()}`,
      userId,
      text,
      sender: sender || 'user',
      createdAt: new Date().toISOString(),
      read: false,
    };
    db.supportMessages.push(msg);
    saveDatabase();
    res.json({ success: true, message: msg });
  });

  // Vite Integration for Dev and Production
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Fallback to transformed index.html so SPA loads smoothly
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Earnlance BD Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
