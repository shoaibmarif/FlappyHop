import React from 'react';
import { Link } from 'react-router-dom';
import { ContentPage } from '../components/layout/ContentPage';
import { Accordion } from '../components/ui/Accordion';
import { FAQ_ITEMS } from '../data/faq';
import { faqJsonLd } from '../seo/head';
import { SITE } from '../seo/site';

export const Faq: React.FC = () => (
  <ContentPage path="/faq" eyebrow="Help" intro="The questions we hear most. If yours isn’t here, send a message." structuredData={faqJsonLd(FAQ_ITEMS)}>
    <Accordion items={FAQ_ITEMS} />
    <p className="mt-8 text-ink-2">
      Still stuck? Email{' '}
      <a href={`mailto:${SITE.author.email}`} className="font-bold text-water underline underline-offset-2">
        {SITE.author.email}
      </a>{' '}
      or see the{' '}
      <Link to="/contact" className="font-bold text-water underline underline-offset-2">
        contact page
      </Link>
      .
    </p>
  </ContentPage>
);
