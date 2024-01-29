#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)notification
{
  self.moduleName = @"coolm1";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  NSApplication *application = [notification object];
  NSDictionary *launchOptions = [notification userInfo];
  BOOL enableTM = NO;
 
  
  if (!self.bridge) {
      self.bridge = [self createBridgeWithDelegate:self launchOptions:launchOptions];
    }
  
  // Create React Native rootView
    RCTPlatformView *rootView = [self createRootViewWithBridge:self.bridge moduleName:self.moduleName initProps:self.initialProps];
    NSViewController *viewController = [[NSViewController alloc] init];
    viewController.view = rootView;
    
    _popover = [[NSPopover alloc] init];
    _popover.contentSize = NSMakeSize(400, 600);
    // Set popover content view as React Native rootView
    _popover.contentViewController = viewController;
    
    // Expands rootView to Popover arrow.
    if (@available(macOS 14.0, *)) {
      _popover.hasFullSizeContent = YES;
    }
    _statusItem = [[NSStatusBar systemStatusBar] statusItemWithLength:NSVariableStatusItemLength];
    
    [_statusItem.button setTitle:@"coolm1"];
    [_statusItem.button setAction:@selector(toggleMenu:)];
  
}

- (void)toggleMenu:(NSMenuItem *)sender
{
  if (_popover.isShown) {
    [_popover performClose:sender];
  } else {
    [_popover showRelativeToRect:_statusItem.button.bounds ofView:_statusItem.button preferredEdge:NSRectEdgeMinY];
    [_popover.contentViewController.view.window becomeKeyWindow];
  }
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
