import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createStat, updateStat, getStatById } from '../api/client';

interface StatFormValues {
  name: string;
  value: number;
  description: string;
}

const StatsForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<StatFormValues>({
    name: '',
    value: 0,
    description: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchStat = async () => {
        setLoading(true);
        setError(null);
        try {
          const stat = await getStatById(Number(id));
          setFormValues({
            name: stat.name,
            value: stat.value,
            description: stat.description,
          });
        } catch (err) {
          setError('Failed to fetch stat details.');
        } finally {
          setLoading(false);
        }
      };

      fetchStat();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: name === 'value' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await updateStat(Number(id), formValues);
      } else {
        await createStat(formValues);
      }
      navigate('/stats');
    } catch (err) {
      setError('Failed to save stat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Stat' : 'Add New Stat'}</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="value">
            Value
          </label>
          <input
            type="number"
            id="value"
            name="value"
            value={formValues.value}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/stats')}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatsForm;