import styled from 'styled-components';

const Container = styled.div`
  background-color: ${({ theme }) => theme.toggleBorder};
  border-radius: 16px;
  padding: 1.5rem;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const DateTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text};

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    color: ${({ theme }) => theme.textLight};
  }
`;

const Tabs = styled.div`
  display: flex;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  overflow: hidden;

  button {
    background: white;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    cursor: pointer;
    border-right: 1px solid #E0E0E0;
    color: ${({ theme }) => theme.textLight};

    &:last-child {
      border-right: none;
    }

    &.active {
      background-color: #66CDAA; 
      color: white;
    }
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr); 
  gap: 0;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  overflow: hidden;
`;

const DayHeader = styled.div`
  padding: 1rem;
  text-align: center;
  font-weight: bold;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text};
  background-color: #F9FAFB;
  border-bottom: 1px solid #E0E0E0;
  border-right: 1px solid #E0E0E0;

  &:nth-child(7n) {
    border-right: none;
  }
`;

const DayCell = styled.div`
  height: 100px; 
  padding: 0.5rem;
  border-right: 1px solid #E0E0E0;
  border-bottom: 1px solid #E0E0E0;
  position: relative;

  &:nth-child(7n) { 
    border-right: none;
  }

  span {
    display: block;
    text-align: right;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.textLight};
    margin-bottom: 0.5rem;
  }
`;

const EventBadge = styled.div`
  background-color: #E6FFFA;
  border-left: 3px solid ${({ theme }) => theme.primary};
  padding: 4px;
  font-size: 0.65rem;
  border-radius: 2px;
  color: ${({ theme }) => theme.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DAYS_HEADER = ['MON', 'TUE', 'WED', 'THE', 'FRI', 'SAT', 'SUN'];
const DAYS_DATA = [
  { day: 25, prevMonth: true }, { day: 26, prevMonth: true }, { day: 27, prevMonth: true }, { day: 28, prevMonth: true }, { day: 29, prevMonth: true }, { day: 30, prevMonth: true }, { day: 1, prevMonth: false },
  { day: 2, prevMonth: false, event: 'Reserva Manicura...' }, { day: 3, prevMonth: false }, { day: 4, prevMonth: false }, { day: 5, prevMonth: false }, { day: 6, prevMonth: false }, { day: 7, prevMonth: false }, { day: 8, prevMonth: false },
  { day: 9, prevMonth: false }, { day: 10, prevMonth: false }, { day: 11, prevMonth: false }, { day: 12, prevMonth: false }, { day: 13, prevMonth: false }, { day: 14, prevMonth: false }, { day: 15, prevMonth: false },
];

export function CalendarWidget() {
  return (
    <Container>
      <Header>
        <span style={{color: '#999'}}>Hoy</span>
        <DateTitle>
          <button>&lt;</button>
          <span>Octubre 2025</span>
          <button>&gt;</button>
        </DateTitle>

        <Tabs>
          <button>Día</button>
          <button>Semana</button>
          <button className="active">Mes</button>
        </Tabs>
      </Header>

      <CalendarGrid>
        {DAYS_HEADER.map(day => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}

        {DAYS_DATA.map((data, index) => (
          <DayCell key={index}>
            <span style={{ opacity: data.prevMonth ? 0.3 : 1 }}>
              {data.day}
            </span>
            {data.event && (
              <EventBadge>
                {data.event}<br/>
                <strong>11:00 am</strong>
              </EventBadge>
            )}
          </DayCell>
        ))}
      </CalendarGrid>
    </Container>
  );
}