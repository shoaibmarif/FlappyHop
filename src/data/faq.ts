export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How do I play?',
    answer:
      'Tap the screen, click, or press Space to make the frog hop. Hop through the gaps between the hanging willow vines and the reeds. Every gap you pass is a point, and the run ends if you bump into something or fall into the water.',
  },
  {
    question: 'What do lily pads do?',
    answer:
      'They are your safety net. If you fall to the water right above a lily pad, it bounces you back up instead of ending the run. Each pad only works once, then it sinks, so don’t rely on finding another one straight away.',
  },
  {
    question: 'What are fireflies and glow bugs for?',
    answer:
      'Fireflies are the pond’s currency. Every one you catch is saved, and collecting enough unlocks new frogs. Catch several in a quick chain for a combo. The rare golden glow bug gives you a shield that saves you from your next bump.',
  },
  {
    question: 'How does the daily pond work?',
    answer:
      'Every day there is one course, the same for everyone, with a goal between 8 and 20 gaps. You can try as many times as you like. Reach the goal on back to back days to build a streak, and share your best without spoiling the course.',
  },
  {
    question: 'Does it get harder?',
    answer:
      'Yes, gently. The pond speeds up and the gaps narrow at 10, 25, 50 and 100 gaps. From 15 gaps on, dragonflies start darting through. The sky changes as you go, from dusk to night to the northern lights.',
  },
  {
    question: 'Does it work on phones? Is it free?',
    answer:
      'It works on phones, tablets and computers, right in the browser, with nothing to install. It is completely free, with no ads inside the game and no sign-up.',
  },
  {
    question: 'Where is my progress saved?',
    answer:
      'In your browser, on this device. There is no account and nothing is uploaded, so your frogs and fireflies won’t follow you to another device, and clearing your browser data removes them.',
  },
];
