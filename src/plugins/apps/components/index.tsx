import * as React from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';

import styles from './apps.module.scss';
import AppCard from './AppCard';
import { useState } from 'react';
import { AppsPluginContent } from '..';

const SORTS = {
  ALPHABETICAL: 'Alphabetical',
  RECENT: 'Most Recent',
};

export default function AppsPage({ apps, categories }: AppsPluginContent) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSort, setActiveSort] = useState(SORTS.ALPHABETICAL);
  const [activeQuery, setActiveQuery] = useState('');
  const [displayedApps, setDisplayedApps] = useState(12); // Number of items initially displayed

  const loadMore = () => {
    // Increase the number of displayed items by 20 when the "Load More" button is clicked
    setDisplayedApps(displayedApps + 8);
  };

  const sortedApps = apps
    .sort((a, b) => {
      if (activeSort === SORTS.ALPHABETICAL) {
        return a.name.localeCompare(b.name, 'en');
      } else if (activeSort === SORTS.RECENT) {
        return new Date(a.date) > new Date(b.date) ? -1 : 1;
      }
    })
    .filter((app) => {
      if (activeQuery && activeQuery !== '') {
        return app.name.toLowerCase().includes(activeQuery);
      } else {
        return true;
      }
    })
    .filter((app) => !activeCategory || app.category === activeCategory[0])
    .slice(0, displayedApps); // Use the 'displayedApps' variable

  const filters = Object.entries(categories);

  const renderSort = (sort) => {
    return (
      <li
        key={sort}
        className={clsx(
          'dropdown__link',
          activeSort === sort && 'dropdown__link--active',
          styles.sortDropdownItem
        )}
        onClick={() => setActiveSort(sort)}
      >
        <span>{sort}</span>
      </li>
    );
  };

  const renderPillFilter = (filter) => {
    const [name, entries] = filter;
    return (
      <li
        key={name}
        className={clsx(
          'pills__item',
          styles.pillFilter,
          activeCategory && activeCategory[0] === name && 'pills__item--active'
        )}
        onClick={() => setActiveCategory(filter)}
      >
        <span>{name}</span>
        <span className={clsx('badge badge--secondary', styles.filterBadge)}>
          {entries.length}
        </span>
      </li>
    );
  };

  return (
    <Layout>
      <main className="margin-vert--xl">
        <h1 className={styles.title}>Showcase</h1>
        <p className={styles.subtitle}>
          Discover <strong>hundreds of production applications</strong> built
          with Electron.
        </p>
        <div className={clsx('margin-bottom--md', styles.filtersContainer)}>
          <div
            className={clsx(
              'container',
              'margin-bottom--sm',
              styles.sortAndSearchContainer
            )}
          >
            <div className="dropdown dropdown--hoverable">
              <button className={clsx('button', styles.sortDropdownButton)}>
                Sort: {activeSort}
              </button>
              <ul className={clsx('dropdown__menu', styles.sortDropdownMenu)}>
                {Object.values(SORTS).map((s) => renderSort(s))}
              </ul>
            </div>
            <div className="navbar__search">
              <input
                className="navbar__search-input"
                placeholder="Search"
                value={activeQuery}
                onChange={(e) => {
                  setActiveQuery(e.target.value);
                }}
              />
            </div>
          </div>
          <ul className={clsx('pills', 'container', styles.pillFiltersList)}>
            <li
              className={clsx(
                'pills__item',
                styles.pillFilter,
                activeCategory === null && 'pills__item--active'
              )}
              onClick={() => setActiveCategory(null)}
            >
              All
            </li>
            {filters
              .sort((a, b) => b[1].length - a[1].length)
              .map((cat) => renderPillFilter(cat))}
          </ul>
        </div>
        <div
          className={clsx(
            styles.appCardContainer,
            styles.allContainer,
            'container',
            'margin-bottom--xl'
          )}
        >
          {sortedApps.map((app) => (
            <AppCard
              key={app.slug}
              name={app.name}
              description={app.description}
              category={app.category}
              highlightColor={app.faintColorOnWhite}
              logo={`https://raw.githubusercontent.com/erickzhao/apps/master/apps/${app.slug}/${app.slug}-icon-128.png`}
              isFavorite={app.isFavorite}
              website={app.website}
              repository={app.repository}
            />
          ))}
        </div>

        {displayedApps < apps.length && (
          <button
            style={{
              backgroundColor: '#00AEFF',
              color: '#fff',
              padding: '16px 30px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '0 auto',
              display: 'block',
              transition: 'background-color 0.3s',
              fontSize: 'medium',
            }}
            onClick={loadMore}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#0088CC')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#00AEFF')}
          >
            Load More
          </button>
        )}
      </main>
    </Layout>
  );
}
