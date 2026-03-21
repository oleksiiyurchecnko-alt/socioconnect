# Styling Examples

## Good Component SCSS

```scss
@layer components {
  :host {
    display: block;
  }

  .card {
    background-color: var(--sc-color-surface);
    border: 1px solid var(--sc-color-border);
    border-radius: var(--sc-radius-lg);
    padding: var(--sc-space-xl);
  }

  .card__title {
    color: var(--sc-color-text);
    font-size: var(--sc-font-size-xl);
    line-height: var(--sc-line-height-tight);
    margin: 0;
  }
}
```

## Bad SCSS

```scss
.card {
  padding: 16px !important;
  background: #fff;

  h2 {
    color: rgb(0 0 0);
  }
}
```

## Valid Imports

```scss
@use '../assets/fonts/fonts';
@use './styles/index';
```

```scss
@use './tokens/colors';
@use './tokens/spacing';
```

## Invalid Imports

```scss
@use '../../../shared/theme';
@use '../../another-domain/ui/card';
@import './legacy';
```
