interface Shift {
    id: number;
    startTime: string;
    endTime: string | null;
    totalHours: number | null;
  }
  
  interface UserShiftsProps {
    shifts: Shift[];
  }
  
  const UserShifts: React.FC<UserShiftsProps> = ({ shifts }) => {
    const formatDuration = (totalHours: number | null): string => {
      if (totalHours === null) return "Em andamento";
  
      const hours = Math.floor(totalHours);
      const minutes = Math.round((totalHours - hours) * 60);
  
      return `${hours}h${minutes < 10 ? "0" : ""}${minutes}m`;
    };
  
    return (
      <div className="my-4">
        <h4>Turnos do Usuário:</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Início</th>
              <th>Fim</th>
              <th>Duração</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.id}>
                <td>{new Date(shift.startTime).toLocaleString()}</td>
                <td>{shift.endTime ? new Date(shift.endTime).toLocaleString() : "Em andamento"}</td>
                <td>{formatDuration(shift.totalHours)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default UserShifts;
  