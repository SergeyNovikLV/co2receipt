export default function FactorSetPage() {
  return (
    <div className="max-w-[1040px] mx-auto p-6">
      <div className="bg-white border border-zinc-200 rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-4">Factor set v2025.1</h1>
        <p className="text-sm text-zinc-600 mb-8">
          Public sources used to compute CO₂ in CO₂ Receipt. Versioned and linkable.
        </p>

        {/* Factors Table */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-zinc-900 mb-4">Emission factors</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Factor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Unit</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Year</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-zinc-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-zinc-900">Transport</td>
                  <td className="px-4 py-3 text-sm text-zinc-900">Diesel passenger car</td>
                  <td className="px-4 py-3 text-sm text-zinc-900">2.31 kg CO₂/L</td>
                  <td className="px-4 py-3 text-sm text-zinc-900">2.31</td>
                  <td className="px-4 py-3 text-sm text-zinc-900">
                    <a href="#" className="text-indigo-700 hover:text-indigo-800 hover:underline">UK GHG Conversion Factors</a>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-900">2024</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-zinc-900">Electricity</td>
                  <td className="px-4 py-3 text-sm text-zinc-900">Country grid intensity</td>
                  <td className="px-4 py-3 text-sm text-zinc-900">kg CO₂/kWh</td>
                  <td className="px-4 py-3 text-sm text-zinc-900">0.28</td>
                  <td className="px-4 py-3 text-sm text-zinc-900">
                    <a href="#" className="text-indigo-700 hover:text-indigo-800 hover:underline">EEA/Ember/OWID</a>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-900">2024</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-zinc-900">Waste</td>
                  <td className="px-4 py-3 text-sm text-zinc-900">Municipal solid waste (kg→CO₂e)</td>
                  <td className="px-4 py-3 text-sm text-zinc-900">0.89 kg CO₂e/kg</td>
                  <td className="px-4 py-3 text-sm text-zinc-900">0.89</td>
                  <td className="px-4 py-3 text-sm text-zinc-900">
                    <a href="#" className="text-indigo-700 hover:text-indigo-800 hover:underline">EPA WARM / national ministry data</a>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-900">2024</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Version History */}
        <div className="border-t border-zinc-200 pt-6">
          <h2 className="text-lg font-medium text-zinc-900 mb-4">Version history & diffs</h2>
          <a 
            href="/factors/diff?v=2025.1&prev=2024.3" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            Diff vs v2024.3 →
          </a>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-zinc-200 pt-6 mt-8">
          <p className="text-xs text-zinc-500">
            Sources are external and may change; we pin versions at time of publishing.
          </p>
        </div>
      </div>
    </div>
  )
}
