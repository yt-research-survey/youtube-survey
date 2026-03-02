/**
 * Google Apps Script for YouTube AI Survey
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com and create a new project
 * 2. Copy and paste this entire script into the editor
 * 3. Click "Deploy" > "New deployment"
 * 4. Select "Web app" as the type
 * 5. Set "Execute as" to "Me"
 * 6. Set "Who has access" to "Anyone"
 * 7. Click "Deploy" and copy the web app URL
 * 8. Replace the GOOGLE_SHEETS_URL in index.html with your new URL
 * 9. Create a Google Sheet and copy its ID from the URL
 * 10. Replace SPREADSHEET_ID below with your sheet's ID
 */

// Replace with your Google Sheet ID (found in the sheet's URL)
const SPREADSHEET_ID = '1XIzblKwranzXr4D3clGttylPIkyYcXnWQ78RDp8iZcw';
const SHEET_NAME = 'YT Survey Responses';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    saveToSheet(data);
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Survey API is running. Use POST to submit data.');
}

function saveToSheet(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Add headers if sheet is empty or first row is empty
  const firstCell = sheet.getRange(1, 1).getValue();
  if (!firstCell) {
    const headers = getHeaders();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  // Prepare row data
  const row = prepareRowData(data);

  // Append row
  sheet.appendRow(row);
}

function getHeaders() {
  return [
    // Metadata
    'participantId',
    'prolificId',
    'startTime',
    'endTime',

    // Treatment Conditions
    'commentCondition',
    'aiThumbnailVideo',

    // Video Selection
    'videoSelected',
    'selectedVideoHadAIThumbnail',

    // First Video Tracking
    'video1_totalPlayTime',
    'video1_videoDuration',
    'video1_playCount',
    'video1_completed',

    // Second Video Tracking
    'video2_totalPlayTime',
    'video2_videoDuration',
    'video2_completed',

    // Video & Creator Perceptions
    'videoHighQuality',
    'videoEnjoyed',
    'wouldSubscribe',

    // Optional Second Video
    'watchedSecondVideo',

    // Comments
    'readComments',
    'commentsRecall',

    // AI Attitudes
    'preferHumanCreated',
    'aiHelpsCreators',
    'canTellAI',
    'videoMadeWithAI',
    'aiPreference',

    // Bot Detection
    'botDetection_aiExplanation',
    'botDetection_containsHiddenPhrase',
    'botDetection_keystrokeCount',
    'botDetection_pasteDetected',
    'botDetection_avgTimeBetweenKeys'
  ];
}

function prepareRowData(data) {
  const responses = data.responses || {};
  const videoTracking = data.videoTracking || {};
  const secondVideoTracking = data.secondVideoTracking || {};
  const botDetection = data.botDetection || {};

  return [
    // Metadata
    data.participantId || '',
    data.prolificId || '',
    data.startTime || '',
    data.endTime || '',

    // Treatment Conditions
    responses.commentCondition || data.commentCondition || '',
    responses.aiThumbnailVideo || data.aiThumbnailVideo || '',

    // Video Selection
    responses.videoSelected || data.videoSelected || '',
    responses.selectedVideoHadAIThumbnail || '',

    // First Video Tracking
    videoTracking.totalPlayTime || 0,
    videoTracking.videoDuration || 0,
    videoTracking.playCount || 0,
    videoTracking.completed || false,

    // Second Video Tracking
    secondVideoTracking.totalPlayTime || 0,
    secondVideoTracking.videoDuration || 0,
    secondVideoTracking.completed || false,

    // Video & Creator Perceptions
    responses.videoHighQuality || '',
    responses.videoEnjoyed || '',
    responses.wouldSubscribe || '',

    // Optional Second Video
    responses.watchedSecondVideo || '',

    // Comments
    responses.readComments || '',
    responses.commentsRecall || '',

    // AI Attitudes
    responses.preferHumanCreated || '',
    responses.aiHelpsCreators || '',
    responses.canTellAI || '',
    responses.videoMadeWithAI || '',
    responses.aiPreference || '',

    // Bot Detection
    botDetection.aiExplanation || '',
    botDetection.containsHiddenPhrase || false,
    botDetection.keystrokeCount || 0,
    botDetection.pasteDetected || false,
    botDetection.avgTimeBetweenKeys || 0
  ];
}

// Test function - run this to create the sheet structure
function testSetup() {
  const testData = {
    participantId: 'TEST123',
    prolificId: 'PROLIFIC_TEST_ID',
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    commentCondition: 'treatment',
    aiThumbnailVideo: 'bobcat',
    videoSelected: 'panther',
    responses: {
      videoSelected: 'panther',
      commentCondition: 'treatment',
      aiThumbnailVideo: 'bobcat',
      selectedVideoHadAIThumbnail: false,
      quality1: '5',
      quality5: '6',
      creator5: '4',
      watchedSecondVideo: 'yes',
      readComments: 'all',
      commentsRecall: 'Test comment recall',
      ai4: '3',
      ai5: '5',
      ai6: '4',
      videoMadeWithAI: 'unsure',
      aiPreference: '3'
    },
    videoTracking: {
      totalPlayTime: 45.5,
      videoDuration: 60,
      playCount: 2,
      completed: true
    },
    secondVideoTracking: {
      totalPlayTime: 16,
      videoDuration: 16,
      completed: true
    }
  };

  saveToSheet(testData);
  Logger.log('Test data saved successfully!');
}
