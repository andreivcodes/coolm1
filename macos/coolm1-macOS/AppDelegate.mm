#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import "TempSensors.h"


@interface RightClickView : NSView
@property (nonatomic, strong) NSTextField *label;
@end

@implementation RightClickView

- (instancetype)initWithFrame:(NSRect)frameRect
{
  self = [super initWithFrame:frameRect];
  if (self) {
    self.label = [[NSTextField alloc] initWithFrame:NSMakeRect(0, 0, frameRect.size.width, frameRect.size.height)];
    [self.label setEditable:NO];
    [self.label setBezeled:NO];
    [self.label setDrawsBackground:NO];
    [self.label setAlignment:NSTextAlignmentCenter];
    [self.label setStringValue:@"Settings"];
    [self addSubview:self.label];
  }
  return self;
}

@end

@interface AppDelegate ()
@property (nonatomic, strong) NSPopover *rightClickPopover;
@property (atomic, assign) BOOL launchOnLogin;
@end

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)notification
{
  self.moduleName = @"coolm1";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  NSDictionary *launchOptions = [notification userInfo];
  
  if (!self.bridge) {
    self.bridge = [self createBridgeWithDelegate:self launchOptions:launchOptions];
  }
  
  // Create React Native rootView
  RCTPlatformView *rootView = [self createRootViewWithBridge:self.bridge moduleName:self.moduleName initProps:self.initialProps];
  NSViewController *viewController = [[NSViewController alloc] init];
  viewController.view = rootView;
  
  _popover = [[NSPopover alloc] init];
  _popover.contentSize = NSMakeSize(600, 400);
  // Set popover content view as React Native rootView
  _popover.contentViewController = viewController;
  
  _statusItem = [[NSStatusBar systemStatusBar] statusItemWithLength:NSVariableStatusItemLength];
  
  NSImage *image = [NSImage imageNamed:@"AppIcon"];
  [image setTemplate:YES];
  [image setSize:NSMakeSize(20, 20)];
  [_statusItem.button setImage:image];
  
  [_statusItem.button setAction:@selector(toggleMenu:)];
  [_statusItem.button sendActionOn:(NSEventMaskLeftMouseDown | NSEventMaskRightMouseDown)];
  
  self.rightClickPopover = [[NSPopover alloc] init];
  
}

- (void)toggleMenu:(NSMenuItem *)sender
{
  NSEvent *event = [NSApp currentEvent];
  
  if ([event type] == NSEventTypeRightMouseDown || [event type] == NSEventTypeRightMouseUp) {
    NSMenu *contextMenu = [[NSMenu alloc] initWithTitle:@"ContextMenu"];
    
    [contextMenu addItemWithTitle:@"Quit" action:@selector(quitApp:) keyEquivalent:@""];
    
    // Display context menu at the mouse location
    [contextMenu popUpMenuPositioningItem:nil atLocation:[NSEvent mouseLocation] inView:nil];
  } else {
    
    if (self.rightClickPopover.isShown) {
      [self.rightClickPopover performClose:sender];
    }
    
    if (_popover.isShown) {
      [_popover performClose:sender];
    } else {
      [_popover showRelativeToRect:_statusItem.button.bounds ofView:_statusItem.button preferredEdge:NSRectEdgeMinY];
      [_popover.contentViewController.view.window becomeKeyWindow];
    }
  }
}

- (void)quitApp:(id)sender
{
  [NSApp terminate:nil];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
#ifdef RN_FABRIC_ENABLED
  return true;
#else
  return false;
#endif
}

@end
