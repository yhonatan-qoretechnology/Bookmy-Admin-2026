export interface Theme {
  body: string;
  text: string;
  textLight: string;
  primary: string;
  cardBg: string;
  inputBg: string;
  toggleBorder: string;
  dashboardBg: string;
  danger: string;  
  warning: string; 
  success: string; 
}

export const lightTheme: Theme = {
  body: '#F3F4F6', 
  dashboardBg: '#F5F6FA', 
  text: '#202224',
  textLight: '#7B7B7B', 
  primary: '#00B69B', 
  cardBg: '#f5eeee',
  inputBg: '#F1F4F9',
  toggleBorder: '#FFF',
  
  danger: '#EF3826',
  warning: '#FFB946',
  success: '#00B69B',
};

export const darkTheme: Theme = {
  body: '#121212',
  dashboardBg: '#1B1B1B',
  text: '#FAFAFA',
  textLight: '#A0A0A0',
  primary: '#00B69B',
  cardBg: '#282C34',
  inputBg: '#3E4149',
  toggleBorder: '#6B8096',
  
  danger: '#CF3021',
  warning: '#DFA03D',
  success: '#009680',
};