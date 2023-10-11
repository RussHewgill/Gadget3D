import { atom } from 'nanostores';

// export const tagFilters = atom<string[]>(["cinderwing"]);
export const tagFilters = atom(new Set());

// export const tagFilters = map({
//   tags: new Set()
// });

// export function updateAddTag(tag: string) {
//   const buttons = document.querySelectorAll('.tag-filter-button');

//   buttons.forEach((item) => {
//     const itemTags = item.getAttribute('data-tags').split(' ');

//     if (itemTags.includes(tag)) {
//       item.style.display = 'flex';
//     } else {
//       item.style.display = 'none';
//     }
//   }

// }

export function clearTagFilters() {
  tagFilters.set(new Set());
}

export function addTagFilters(tag: string) {
  // tagFilters.value.push();
  tagFilters.set(tagFilters.get().add(tag));
}

export function toggleTagFilters(tag: string) {
  const ts = tagFilters.get();
  if (ts.has(tag)) {
    console.log("deleting tag " + tag);
    ts.delete(tag);
    tagFilters.set(ts);
    return false;
  } else {
    console.log("adding tag " + tag);
    ts.add(tag);
    tagFilters.set(ts);
    return true;
  }
}

export function getTagFilters() {
  const ts = tagFilters.get();
  // console.log("wat");

  ts.forEach((t) => {
    console.log(t);
  })
}
