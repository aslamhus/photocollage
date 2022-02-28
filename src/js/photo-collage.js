import { FileSelect } from '../../node_modules/@aslamhus/fileselect/lib/FileSelect.mjs';

let instagramPost;
let images = [];
let rows = 3;
let columns = 3;
let imageLimit = 9;
let remainder;
let anchor = 'rows';
let rulers = false;
let fit = 'cover';
// elements
let rangeRows, rangeColumns;
let gridOptions;
let numberOfPhotos;
let btnSaveImage;
let canvasModal;
// testing
let msg;

const displayOptions = (display) => {
  if (display) {
    gridOptions.forEach((options) => options.classList.remove('hidden'));
  } else {
    gridOptions.forEach((options) => options.classList.add('hidden'));
  }
};

const setNumberOfPhotos = (number) => (numberOfPhotos.innerHTML = `Number of logos: ${number}`);

const selectLogos = () => {
  const FS = new FileSelect();
  FS.removeFiles();
  images = [];
  FS.select().then((files) => {
    // files.forEach((dataURL) => {
    FS.readFiles(files).then((dataURLs) => {
      dataURLs.forEach((dataURL) => {
        // console.log(file);
        // return;
        const img = document.createElement('img');
        // console.log(dataURL);
        //   img.src = `./images/production-companies/${dataURL.name}`;
        //   console.log('src');
        img.src = `${dataURL.data}`;
        img.title = 'name' + dataURL.name;
        images.push(img);
      });
      setNumberOfPhotos(images.length);
      setMax(images.length);
      setRows(3);
      buildImage();
    });
  });
};

/* BUILDERS */

const buildCell = (cellIndex) => {
  if (!images[cellIndex]) {
    console.log(' ****** images[cellIndex] returned null', cellIndex);
    console.log(images[cellIndex]);
    return null;
  }
  const cellFragment = document.createDocumentFragment();
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.style.width = `${((1 / columns) * 100).toFixed(2)}%`;
  const img = images[cellIndex];
  img.style.objectFit = fit;
  //   img.style.objectPosition = `${(Math.random() * 200).toFixed(0)}px ${(Math.random() * 200).toFixed(
  //     0
  //   )}px`;
  img.style.objectPosition = 'center center';

  cell.append(img);
  cellFragment.append(cell);
  return cell;
};

const buildRow = (rowIndex) => {
  const rowFragment = document.createDocumentFragment();
  const row = document.createElement('div');
  row.classList.add('row');
  row.style.height = `${((1 / rows) * 100).toFixed(2)}%`;
  rowFragment.append(row);
  let max = (rowIndex + 1) * columns;
  let base = rowIndex * columns;
  let additional = 0;
  if (anchor == 'rows' && remainder > 0 && rowIndex > rows - remainder - 1) {
    additional = 1;
  }
  max = max + additional;
  if (anchor == 'rows' && remainder > 0 && rowIndex > rows - remainder) {
    base = base + 1;
  }
  for (let i = base; i < max; i++) {
    msg += `${i}, `;
    const cell = buildCell(i);
    if (cell) row.append(cell);
  }
  return rowFragment;
};

const buildImage = () => {
  displayOptions(true);
  resetBuilder();
  //   console.log('---------build');
  if (anchor == 'column') {
    // console.log('add to rows', Math.ceil(remainder / columns));
    rows = rows + Math.ceil(remainder / columns);
    setRows(rows);
  }
  for (let i = 0; i < rows; i++) {
    msg = `${i}: [`;
    instagramPost.append(buildRow(i));
    msg = msg.replace(/(,\s){1}$/, '');
    // console.log(`${msg}]`);
  }
  //   console.log('-----------end build/');
};

/* SETTERS */

const setMax = (max) => {
  rangeRows.setAttribute('max', max);
  rangeColumns.setAttribute('max', max);
  if (columns > max) setColumns(max);
  if (rows > max) setColumns(max);
};

const setColumns = (value) => {
  columns = value;
  /* Constraints */
  if (value > images.length) value = images.length - 1;
  // row max = the number of logos divided by columns
  // setColumns(3)
  // rowMax = 13 /3 = 4.333 => 5
  // setRows(3)
  if (anchor == 'column') {
    remainder = images.length % value;
    let rowMin = Math.floor(images.length / value);
    console.log(`setRows(${rowMin})`);
    if (rows != rowMin) setRows(rowMin);
  }
  //   remainder = images.length % value;
  //   if (rows != rowMin) setRows(rowMin);
  //   let columnMax = images.length;
  //   let rowMin = 1;
  //   //   let columnMin =
  //   setMin(value, )
  //   setMax(rowMax, columnMax);
  //   if (rows > rowMax) setRows(rowMax);
  const label = rangeColumns.previousElementSibling;
  label.textContent = `Columns: ${value}`;
};

const setRows = (value) => {
  rows = value;
  if (value > images.length) value = images.length;
  // column max = number of logos divided by rows
  // setRows(7)
  // columnMax = 9 / 7 = 1.28 => 2
  if (anchor == 'rows') {
    remainder = images.length % value;
    let colMin = Math.floor(images.length / value);
    if (columns != colMin) setColumns(colMin);
  }
  //   let columnMax = Math.floor(images.length / value);
  //   let rowMax = images.length - 1;
  //   setMax(rowMax, columnMax);
  //   if (columns > columnMax) setColumns(columnMax);
  const label = rangeRows.previousElementSibling;
  label.textContent = `Rows: ${value}`;
};

const setAnchor = (value) => (anchor = value);

const resetBuilder = () => {
  instagramPost.innerHTML = '';
};

const setFit = (value) => {
  fit = value;
  document.querySelectorAll('#instagram-post img').forEach((img) => (img.style.objectFit = value));
};

const setBackgroundPosition = (value) => {
  document.querySelectorAll('.cell img').forEach((img) => (img.style.objectPosition = value));
};

/* Events */

const handleColumnsChange = ({ target: { value } }) => {
  console.log('handleColumnsChange', value);
  setAnchor('column');
  setColumns(value);
  buildImage();
};

const handleRowsChange = ({ target: { value } }) => {
  setAnchor('rows');
  setRows(value);
  buildImage();
};

const handleRowPaddingChange = ({ target: { value } }) => {
  instagramPost.style.setProperty('--row-padding', `${value}px`);
};

const handleCellPaddingChange = ({ target: { value } }) => {
  instagramPost.style.setProperty('--cell-padding', `${value}px`);
};

const handleCheckboxToggleRulers = (event) => {
  console.log(event.target.checked);
  instagramPost.classList.toggle('rulers');
};

const handlePortraitButton = (event) => {
  instagramPost.classList.remove('square');
  instagramPost.classList.add('portrait');
};

const handleSquareButton = (event) => {
  instagramPost.classList.add('square');
  instagramPost.classList.remove('portrait');
};

const handleObjectFitChange = ({ target: { value } }) => {
  setFit(value);
};

const handleBackgroundPosChange = ({ target: { value } }) => {
  const match = value.match(
    /(left top|center top|right top|right center|right bottom|center bottom|left bottom|left center|center center|[0-9]*(\%|px))$/
  );
  if (match) {
    setBackgroundPosition(value);
  }
};

const handleConfirmSave = (event) => {
  // get canvas
  const canvas = document.querySelector('canvas');
  canvas.toBlob(
    (blob) => {
      saveToFile(blob);
    },
    'image/jpeg',
    1
  );
};

const attachEvents = () => {
  const btnSelectLogos = document.querySelector('#select-logos');
  btnSelectLogos.onclick = selectLogos;
  btnSaveImage = document.querySelector('#save-image');
  btnSaveImage.onclick = saveImage;
  rangeColumns = document.querySelector('#range-columns');
  rangeColumns.onchange = handleColumnsChange;
  rangeRows = document.querySelector('#range-rows');
  rangeRows.onchange = handleRowsChange;
  const rangeRowPadding = document.querySelector('#row-padding');
  rangeRowPadding.onchange = handleRowPaddingChange;
  const rangeCellPadding = document.querySelector('#cell-padding');
  rangeCellPadding.onchange = handleCellPaddingChange;
  const checkboxToggleRulers = document.querySelector('#rulers-toggle');
  checkboxToggleRulers.onclick = handleCheckboxToggleRulers;
  const btnPortrait = document.querySelector('#portrait');
  btnPortrait.onclick = handlePortraitButton;
  const btnSquare = document.querySelector('#square');
  btnSquare.onclick = handleSquareButton;
  const radioObjectFit = document.querySelectorAll("input[name='object-fit']");
  radioObjectFit.forEach((radio) => (radio.onchange = handleObjectFitChange));
  btnPortrait.onclick = handlePortraitButton;
  const btnDismissModal = document.querySelector('button[data-dismiss]');
  btnDismissModal.onclick = dismissModal;
  const inputBackgroundPosition = document.querySelector('#background-position');
  inputBackgroundPosition.onkeyup = handleBackgroundPosChange;
  const btnConfirmSave = document.querySelector('#confirm-save');
  btnConfirmSave.onclick = handleConfirmSave;
};

/* API */

const saveToFile = async (blob) => {
  console.log('blob', blob);
  blob.lastModifiedDate = new Date();
  blob.name = 'photoCollage.jpeg';
  blob.uuid = 'photoCollage-' + Date.now() + '.jpeg';
  const file = new File([blob], 'photoCollage.jpeg', {
    type: blob.type,
  });
  const FS = new FileSelect();
  const fileRead = await FS.readFiles(file);
  // location.href = 'data:application/octet-stream;base64,' + fileRead.data;
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.download = fileRead.name;
  a.href = fileRead.data;
  a.click();

  return;
  const save = await fetch('./controller/save-photo-collage.php', {
    method: 'POST',
    headers: {
      X_REQUESTED_WITH: 'XMLHttpRequest',
    },
    body: JSON.stringify({ file: fileRead }),
  })
    .catch((error) => {
      console.log('File Error', error);
    })
    .then((result) => {
      if (!result.ok) {
        console.log('Result was not okay', result.status);
        return false;
      }
      return result.json();
    });
  console.log('save', save);
};

/* Canvas */

const addCanvasToModal = (canvas) => {
  const modalBody = canvasModal.querySelector('.modal-body');
  modalBody.innerHTML = '';
  modalBody.append(canvas);
};

const openModal = () => {
  canvasModal.classList.add('show');
};

const dismissModal = () => {
  canvasModal.classList.remove('show');
};

const getSlice = (cell, img, cellOrientation, imgOrientation, cellAspect, imgAspect) => {
  const slice = { width: 0, height: 0 };
  if (cellOrientation == 'landscape') {
    // width is anchor, find height
    let ratio = img.width / cell.width;
    slice.height = cell.height * ratio;
    slice.width = img.width;
  } else if (cellOrientation == 'portrait') {
    // height is anchor, find width
    let ratio = img.height / cell.height;
    slice.width = cell.width * ratio;
    slice.height = img.height;
  } else if (cellOrientation == 'square') {
    // for a cell with a square orientation,
    // we use the opposite rules defined above
    // if the img is landscape, the anchor is its height
    // if the img is portrait, the anchor is its width
    if (imgOrientation == 'landscape') {
      // height is anchor, find width
      let ratio = img.height / cell.height;
      slice.width = cell.width * ratio;
      slice.height = img.height;
    } else if (imgOrientation == 'portrait') {
      // width is anchor, find height
      let ratio = img.width / cell.width;
      slice.height = cell.height * ratio;
      slice.width = img.width;
    }
  } else {
    console.log('**** UNCAUGHT EXCEPTION!!', imgOrientation, cellOrientation);
  }
  return slice;
};

const getPosition = (cell, img, objectPosition, slice) => {
  const offset = { x: 0, y: 0 };
  console.log('position', objectPosition);
  let percentOffset = { x: 0, y: 0 };
  switch (objectPosition) {
    case 'center':
    case '50% 50%':
    case '50%':
      // find 50% of x and 50% of y
      if (cell.width > cell.height || cell.width == cell.height) {
        // width is anchor, find y offset in source dest
        offset.y = img.height / 2 - slice.height / 2;
      } else if (cell.height > cell.width) {
        // height is anchor, find x offset
        offset.x = img.width / 2 - slice.width / 2;
      } else if (cell.height == cell.width) {
        // do we need a square contingency?
        console.log('***** square contingency *******');
      }
      console.log('Position: 50% 50% or center');
      break;
    case 'left top':
      offset.x = 0;
      offset.y = 0;
      break;
    case 'center top':
      offset.x = img.width / 2 - slice.width / 2;
      offset.y = 0;
      break;
    case 'right top':
      offset.x = img.width - slice.width;
      offset.y = 0;
      break;
    case 'right center':
      offset.x = img.width - slice.width;
      offset.y = img.height / 2 - slice.height / 2;
      break;
    case 'right bottom':
      offset.x = img.width - slice.width;
      offset.y = img.height - slice.height;
      break;
    case 'center bottom':
      offset.x = img.width / 2 - slice.width / 2;
      offset.y = img.height - slice.height;
      break;
    case 'left bottom':
      offset.x = 0;
      offset.y = img.height - slice.height;
      break;
    case 'left center':
      offset.x = 0;
      offset.y = img.height / 2 - slice.height / 2;
      break;
    default:
      // percentage values
      const [x, y] = objectPosition.match(/[0-9]*[^%\s]/g);
      const percentX = 100 / parseInt(x);
      const percentY = 100 / parseInt(y);
      offset.x = img.width / percentX - slice.width / percentX;
      offset.y = img.height / percentY - slice.height / percentY;
      console.log('default percent values', x, y, percentX, percentY);
  }
  return offset;
};

const getAspectRatio = (width, height) => (width / height).toFixed(5);

const getOrientation = (aspectRatio) => {
  let orientation;
  orientation = aspectRatio > 1 ? 'landscape' : 'portrait';
  if (aspectRatio == 1) orientation = 'square';
  return orientation;
};

const getObjectPositionValues = (objectPosition) => {
  const [x, y] = objectPosition.match(/[0-9]*(px|\%)/g) || [0, 0];
  return { x, y };
};

const saveImage = () => {
  const bounds = instagramPost.getBoundingClientRect();

  const canvas = document.createElement('canvas');
  canvas.width = bounds.width;
  canvas.height = bounds.height;
  const cells = instagramPost.querySelectorAll('.cell');
  const context = canvas.getContext('2d');

  cells.forEach((el, index) => {
    const { top, left } = el.getBoundingClientRect();
    const objectPosition = el.querySelector('img').style.objectPosition;
    const cell = el.querySelector('img').getBoundingClientRect();
    const img = new Image();
    img.src = el.querySelector('img').src;
    console.log(`-------img ${index}`);

    // get the aspect ratio
    const cellAspect = getAspectRatio(cell.width, cell.height);
    const imgAspect = getAspectRatio(img.width, img.height);
    // then the orientation
    const cellOrientation = getOrientation(cellAspect);
    const imgOrientation = getOrientation(imgAspect);
    // next we define the size and position of the cut to make to the original image
    // 1) get the slice (the width/height of source image cut)
    // 2) then the offset (x/y of source image or where to start cutting)
    let slice = { width: null, height: null };
    let sourceOffset = { x: 0, y: 0 };
    let destOffset = {
      x: left - bounds.left,
      y: top - bounds.top,
    };
    let destination = {
      width: cell.width,
      height: cell.height,
    };
    switch (fit) {
      case 'cover':
        console.log('fit', 'cover');
        slice = getSlice(cell, img, cellOrientation, imgOrientation, cellAspect, imgAspect);
        sourceOffset = getPosition(cell, img, objectPosition, slice);
        console.log('offset', sourceOffset);
        const percentValues = objectPosition.match(/%/);
        let match;
        if (!percentValues || percentValues.length == 0)
          match = objectPosition.match(/[0-9]*[^A-Za-z\s]/g);
        console.log('match', match);
        destOffset;
        let destX = 0;
        let destY = 0;
        if (match) {
          [destX, destY] = match;
        }
        // console.log('img', { width: img.width, height: img.height });
        // console.log('slice', slice);
        // console.log('cell', { width: cell.width, height: cell.height });
        // console.log('dest offset', destX, destY);
        if (destX > 0 || destY > 0) {
          // account for any object position offset (i.e. object-fit: 20px 50px)
          slice.width = slice.width - parseInt(destX) * (slice.width / cell.width);
          slice.height = slice.height - parseInt(destY) * (slice.height / cell.height);
          destOffset.x = destOffset.x + destX;
          destOffset.y = destOffset.y + destY;
          destination.width = destination.width - destX;
          destination.height = destination.height - destX;
        }
        // console.log('slice', slice);
        break;
      case 'contain':
        // console.log(getPosition(cell, img, objectPosition, slice));
        const containOffset = getObjectPositionValues(objectPosition);
        console.log('containOffset', containOffset);
        if (imgOrientation == 'landscape' && cellOrientation == 'landscape') {
          destination.height = destination.height;
          destination.width = (img.width / img.height) * destination.height;
        } else if (imgOrientation == 'portrait' && cellOrientation == 'portrait') {
          destination.width = destination.width;
          destination.height = (img.height / img.width) * destination.width;
        } else if (imgOrientation == 'landscape' && cellOrientation == 'portrait') {
          destination.width = destination.width;
          destination.height = (img.height / img.width) * destination.width;
        } else if (imgOrientation == 'portrait' && cellOrientation == 'landscape') {
          destination.height = destination.height;
          destination.width = (img.width / img.height) * destination.height;
        } else if (imgOrientation == 'portrait' && cellOrientation == 'square') {
          destination.height = destination.height;
          destination.width = (img.width / img.height) * destination.height;
        } else if (imgOrientation == 'landscape' && cellOrientation == 'square') {
          destination.width = destination.width;
          destination.height = (img.height / img.width) * destination.width;
        }
      // in contain, we take the whole source image, always from 0,0.
      // however, we need to scale it down in the dest coordinates
    }

    context.drawImage(
      img,
      sourceOffset.x || 0, // source x
      sourceOffset.y || 0, // source y
      slice.width || img.width, // source width
      slice.height || img.height, // source height
      destOffset.x, // destination x
      destOffset.y, // destination y
      destination.width, // destination width
      destination.height // destination height
    );
  });
  addCanvasToModal(canvas);
  openModal();
};

window.onload = () => {
  attachEvents();
  // get elements
  instagramPost = document.querySelector('#instagram-post');
  gridOptions = document.querySelectorAll('.grid-options');
  numberOfPhotos = document.querySelector('#number-of-photos');
  canvasModal = document.querySelector('#canvasModal');
};
