import { CATEGORY_CONFIG } from '../../constants/categories';

interface CategoryFilterProps {
  activeCategories: string[];
  onToggle: (categoryId: string) => void;
  onSelectAll: () => void;
}

export function CategoryFilter({ activeCategories, onToggle, onSelectAll }: CategoryFilterProps) {
  const allActive = activeCategories.length === 0;
  const entries = Object.entries(CATEGORY_CONFIG);

  return (
    <div className="space-y-2.5">
      <h3 className="text-[11px] font-mono font-semibold tracking-widest text-[var(--text-faint)] uppercase">
        Filter by Category
      </h3>
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={onSelectAll}
          className="px-2.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all duration-150"
          style={{
            background: allActive ? 'var(--teal-glow)' : 'transparent',
            border: `1px solid ${allActive ? 'var(--teal)' : 'var(--border)'}`,
            color: allActive ? 'var(--teal)' : 'var(--text-muted)',
          }}
        >
          All
        </button>
        {entries.map(([id, config]) => {
          const isActive = activeCategories.includes(id);
          return (
            <button
              key={id}
              onClick={() => onToggle(id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all duration-150"
              style={{
                background: isActive ? `${config.color}20` : 'transparent',
                border: `1px solid ${isActive ? config.color : 'var(--border)'}`,
                color: isActive ? config.color : 'var(--text-muted)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: config.color }}
              />
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
