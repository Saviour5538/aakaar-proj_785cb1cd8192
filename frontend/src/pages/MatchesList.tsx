import React, { useEffect, useState } from 'react';
import { getMatches, deleteMatch } from '../api/client';
import { useNavigate } from 'react-router-dom';

interface Match {
  id: string;
  player1: string;
  player2: string;
  winner: string;
  created_at: string;
  updated_at: string;
}

const MatchesList: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getMatches();
        setMatches(response);
      } catch (err) {
        setError('Failed to fetch matches.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteMatch(id);
      setMatches((prev) => prev.filter((match) => match.id !== id));
    } catch (err) {
      setError('Failed to delete match.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter((match) =>
    match.player1.toLowerCase().includes(search.toLowerCase()) ||
    match.player2.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Matches</h1>
        <button
          onClick={() => navigate('/matches/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New
        </button>
      </div>
      <input
        type="text"
        placeholder="Search by player name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Player 1</th>
            <th className="border border-gray-300 px-4 py-2">Player 2</th>
            <th className="border border-gray-300 px-4 py-2">Winner</th>
            <th className="border border-gray-300 px-4 py-2">Created At</th>
            <th className="border border-gray-300 px-4 py-2">Updated At</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMatches.map((match) => (
            <tr key={match.id}>
              <td className="border border-gray-300 px-4 py-2">{match.id}</td>
              <td className="border border-gray-300 px-4 py-2">{match.player1}</td>
              <td className="border border-gray-300 px-4 py-2">{match.player2}</td>
              <td className="border border-gray-300 px-4 py-2">{match.winner}</td>
              <td className="border border-gray-300 px-4 py-2">{match.created_at}</td>
              <td className="border border-gray-300 px-4 py-2">{match.updated_at}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => navigate(`/matches/${match.id}`)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(match.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchesList;