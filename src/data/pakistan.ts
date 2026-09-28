// Pakistan Provinces & Major Cities Data

export interface Province {
  code: string;
  name: string;
  cities: string[];
}

export const pakistanProvinces: Province[] = [
  {
    code: 'PUNJAB',
    name: 'Punjab',
    cities: [
      'Lahore', 'Faisalabad', 'Rawalpindi', 'Gujranwala', 'Multan',
      'Sialkot', 'Bahawalpur', 'Sargodha', 'Sheikhupura', 'Rahim Yar Khan',
      'Jhang', 'Gujrat', 'Sahiwal', 'Wah Cantonment', 'Dera Ghazi Khan',
      'Kasur', 'Mardan', 'Mingaora', 'Nawabshah', 'Okara',
      'Mirpur Khas', 'Chiniot', 'Kamoke', 'Burewala', 'Jhelum',
      'Sadiqabad', 'Khanewal', 'Hafizabad', 'Kohat', 'Jacobabad',
      'Muzaffargarh', 'Shikarpur', 'Bahawalnagar', 'Tando Adam', 'Lodhran',
      'Daska', 'Pakpattan', 'Bahawalnagar', 'Toba Tek Singh', 'Vehari',
      'Attock', 'Nowshera', 'Swabi', 'Charsadda', 'Haripur'
    ]
  },
  {
    code: 'SINDH',
    name: 'Sindh',
    cities: [
      'Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah',
      'Mirpur Khas', 'Thatta', 'Dadu', 'Badin', 'Tando Allahyar',
      'Tando Muhammad Khan', 'Umerkot', 'Sanghar', 'Khairpur',
      'Shikarpur', 'Jacobabad', 'Kashmore', 'Ghotki', 'Matiari',
      'Jamshoro', 'Tharparkar', 'Kamber Shahdadkot'
    ]
  },
  {
    code: 'KPK',
    name: 'Khyber Pakhtunkhwa',
    cities: [
      'Peshawar', 'Mardan', 'Mingaora', 'Kohat', 'Abbottabad',
      'Dera Ismail Khan', 'Chitral', 'Nowshera', 'Swabi', 'Charsadda',
      'Haripur', 'Bannu', 'Batkhela', 'Hangu', 'Tank',
      'Lakki Marwat', 'Karak', 'Shangla', 'Dir', 'Malakand'
    ]
  },
  {
    code: 'BALOCHISTAN',
    name: 'Balochistan',
    cities: [
      'Quetta', 'Gwadar', 'Turbat', 'Chaman', 'Khuzdar',
      'Jafarabad', 'Hub', 'Mastung', 'Kharan', 'Nushki',
      'Pishin', 'Zhob', 'Loralai', 'Sibi', 'Kalat',
      'Dera Bugti', 'Kech', 'Panjgur', 'Lasbela', 'Barkhan'
    ]
  },
  {
    code: 'GB',
    name: 'Gilgit-Baltistan',
    cities: [
      'Gilgit', 'Skardu', 'Hunza', 'Astore', 'Diamer',
      'Ghizer', 'Ghanche', 'Shigar', 'Kharmang'
    ]
  },
  {
    code: 'AJK',
    name: 'Azad Jammu & Kashmir',
    cities: [
      'Muzaffarabad', 'Mirpur', 'Kotli', 'Rawalakot', 'Bagh',
      'Bhimber', 'Haveli', 'Neelum', 'Sudhanoti', 'Poonch'
    ]
  },
  {
    code: 'ICT',
    name: 'Islamabad Capital Territory',
    cities: ['Islamabad']
  }
];

export const getAllPakistaniCities = (): string[] => {
  const cities: string[] = [];
  pakistanProvinces.forEach(p => cities.push(...p.cities));
  return [...new Set(cities)].sort();
};

export const getCitiesByProvince = (provinceCode: string): string[] => {
  const province = pakistanProvinces.find(p => p.code === provinceCode);
  return province ? province.cities.sort() : [];
};

// Pakistani Phone Code
export const PAKISTAN_PHONE_CODE = '+92';

// Currency Formatter for PKR
export const formatPKR = (amount: number): string => {
  return `Rs. ${amount.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const formatPKRDecimal = (amount: number): string => {
  return `Rs. ${amount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
