export interface Service {
  name: string;
  blurb: string;
}

export interface OpeningHours {
  days: string;
  open: string;
}

export interface Business {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  suburb: string;
  services: Service[];
  hours: OpeningHours[];
}
