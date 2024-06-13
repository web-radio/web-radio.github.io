<template>
  <div class="skeleton-loader">
    <div class="skeleton-loader__image" />
    <div class="skeleton-loader__name" />
    <div class="skeleton-loader__details">
      <div
        class="skeleton-loader__details-chip"
        v-for="(width, i) in [68, 120, 56, 78, 95, 43, 56]"
        :key="i"
        :style="{ width: width + 'px' }"
      />
    </div>
    <div class="skeleton-loader__actions">
      <div class="skeleton-loader__actions-button" />
      <div class="skeleton-loader__actions-button" />
      <div class="skeleton-loader__actions-button" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes skeleton-loading {
  0% {
    background-color: #4a4a4a;
  }
  100% {
    background-color: #2f2f2f;
  }
}

.skeleton-loader {
  border-radius: 7px;
  background: #ffffff04;
  display: grid;
  grid-template-columns: minmax(auto, max-content) 1fr min-content;
  grid-template-rows: repeat(2, min-content);
  grid-column-gap: 17.5px;
  grid-row-gap: 10px;
  border: 1px solid #ffffff10;
  padding: 20px 17.5px;

  .skeleton-loader__image {
    grid-area: 1 / 1 / 2 / 2;
    animation: skeleton-loading 1s linear infinite alternate;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    height: 40px;
    border: none;
    outline: none;
    border-radius: 5px;
  }

  .skeleton-loader__name {
    grid-area: 1 / 2 / 2 / 3;
    animation: skeleton-loading 1s linear infinite alternate;
    height: 17px;
    margin: 14.5px 0;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    border-radius: 3px;
  }

  .skeleton-loader__details {
    grid-area: 2 / 1 / 2 / 4;
    font-size: 0.9em;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    max-height: 62px;
    overflow: hidden;

    .skeleton-loader__details-chip {
      padding: 2px 8px;
      border-radius: 5px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      height: 28px;
      animation: skeleton-loading 1s linear infinite alternate;
    }
  }

  .skeleton-loader__actions {
    grid-area: 1 / 3 / 2 / 4;
    flex-basis: 100%;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: end;

    .skeleton-loader__actions-button {
      animation: skeleton-loading 1s linear infinite alternate;
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      width: 30px;
      height: 30px;
      border-radius: 7px;
    }
  }
}
</style>
